# Welcome to TESTMAN

Testman에 오신 걸 환영합니다!

저희 Testman은 API 테스트와 부하 테스트 그리고 간단한 성능 테스트까지 종합적인 테스트가 가능합니다.

테스트는 Workspace별로 관리되어 한번의 URL 입력으로 다양한 테스트를 경험할 수 있어요!

## Environment

프로젝트 개발시 환경과 동일합니다.

Backend :
```
- java version : 8
- jmeter version : 5.4.1
- gradle : 7.1.1
```
<!-- ```
- prometheous
- grafana
``` -->

Frontend :
```
- yarn version : 1.22.10
- npm version : 6.14.13
- react version : 17.0.2
- next version : 12.0.1
```

Database :
```
- mysql version : 8.0.26
- redis version : alpine
```
## How to Run

Testman의 실행은 docker-compose로 이루어집니다.

### Docker, Docker-compose version!

```
- Docker version 20.10.8
- Docker-compose version 1.29.2
```

### Simply Install with docker!

프로젝트를 pull 합니다.

```
git pull https://github.com/henh-testman/TESTMAN.git
```
Docker-compose 를 사용하세요!

```
docker-compose up
```

+ mysql, redis 스토리지가 추가로 필요합니다!

## Authors

* **김나현** | *팀원-BE*  | [nhkiiim](https://github.com/nhkiiim)
* **안진흥** | *팀원-BE*  | [heung27](https://github.com/heung27)
* **이승엽** | *팀원-BE*  | [Seungyeup](https://github.com/Seungyeup)
* **이재민** | *팀장(리더)-FE*  | [edenist-x-x](https://github.com/edenist-x-x)
* **장진호** | *팀원-FE*  | [Jinhoss](https://github.com/Jinhoss)


See also the list of [contributors](https://github.com/henh-testman/TESTMAN/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
