
FROM openjdk:8-jdk

LABEL maintainer="wlsgmd1535@naver.com"

EXPOSE 8080

ARG JAR_FILE=build/libs/testman-0.0.1-SNAPSHOT.jar

COPY ${JAR_FILE} testman.jar

ENTRYPOINT ["java","-jar","/testman.jar"]