package com.henh.testman.common.auth;

import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.henh.testman.common.errors.NotFoundException;
import com.henh.testman.common.utils.JwtTokenUtil;
import com.henh.testman.users.User;
import com.henh.testman.users.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthenticationFilter extends BasicAuthenticationFilter {

	private final UserService userService;

    private final Logger log = LoggerFactory.getLogger(getClass());

	public JwtAuthenticationFilter(AuthenticationManager authenticationManager, UserService userService) {
		super(authenticationManager);
		this.userService = userService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		// Read the Authorization header, where the JWT Token should be
        String header = request.getHeader(JwtTokenUtil.HEADER_STRING);

        // If header does not contain BEARER or is null delegate to Spring impl and exit
        if (header == null || !header.startsWith(JwtTokenUtil.TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }    
        try {
            // If header is present, try grab user principal from database and perform authorization
            Authentication authentication = getAuthentication(request);
            // jwt ???????????? ?????? ????????? ?????? ??????(authentication) ??????.
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception e) {
            log.warn("Jwt processing failed: {}", e.getMessage());
            return;
        }
        filterChain.doFilter(request, response);
	}

	@Transactional(readOnly = true)
    public Authentication getAuthentication(HttpServletRequest request) throws Exception {
        String token = request.getHeader(JwtTokenUtil.HEADER_STRING);
        // ?????? ????????? Authorization ????????? jwt ????????? ????????? ????????????, ?????? ?????? ??? ?????? ?????? ?????? ??????.
        if (token != null) {
            // parse the token and validate it (decode)
            JWTVerifier verifier = JwtTokenUtil.getVerifier();
            JwtTokenUtil.handleError(token);
            DecodedJWT decodedJWT = verifier.verify(token.replace(JwtTokenUtil.TOKEN_PREFIX, ""));
            String id = decodedJWT.getSubject();
            // Search in the DB if we find the user by token subject (username)
            // If so, then grab user details and create spring auth token using username, pass, authorities/roles
            if (id != null) {
                // jwt ????????? ????????? ?????? ??????(id) ?????? ?????? ????????? ?????? ????????? ????????? ????????? ??????.
                User user = userService.selectUser(id)
                        .orElseThrow(() -> new NotFoundException("Could nof found user for " + id));

                // ????????? ?????? ????????? ??????, ?????? context ????????? ?????? ????????? ?????? ??????(jwtAuthentication) ??????.
                TestmanUserDetails userDetails = new TestmanUserDetails(user);
                UsernamePasswordAuthenticationToken jwtAuthentication = new UsernamePasswordAuthenticationToken(id,
                        null, userDetails.getAuthorities());
                jwtAuthentication.setDetails(userDetails);
                return jwtAuthentication;
            }
            return null;
        }
        return null;
    }
}
