package com.henh.testman.workspaces;

import com.henh.testman.common.utils.BaseEntity;
import com.henh.testman.users.User;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Workspace extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    private String title;

    private String url;

    private String description;

    private String img;

    private LocalDateTime createDate;

    public void update(String title, String url, String description){
        this.title = title;
        this.url = url;
        this.description = description;
    }

}
