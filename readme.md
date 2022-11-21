# GraphQL api 만들기

## API란❓

**Application Programming Interface -> 인터페이스이다.**

인터페이스란 무언가와 상호작용 하기위한 버튼이라고 생각하면 쉽다.<br>
리모컨의 버튼은 텔레비전을 만든 사람이 노출시킨 인터페이스이다.<br>
버튼을 조작함으로써 볼륨을 줄이거나 채널을 돌릴 수 있다.

드론의 인터페이스는 tv보다는 조종의 기능만 하기때문에<br>
커맨드(상호작용할 명령어)가 적어 훨씬 간단하다.

<br>

## Rest Api

**rest api는 url로 통신이 이뤄진다.**

`{baseURL}/common/hotels/:id` 등 url을 보고 의도를 이해하기 쉽다는 장점이 있다.<br>
데이터를 post 할때, `{baseURL}/common/create/hotel/` 이런식으로 요청할 것 같지만,<br>
url에는 관행적으로 동사를 쓰지 않는다. <br>
create, add, plus 등 표준적이지 않은 동사를 사용할 수 있기 때문이다.

그 대신 `http메서드`를 이용한다. http의 표준 명세이다.

<br>

## http + rest

`get post delete put` 등의 메서드 + rest 로 사용한다.

<br>

---

## Rest API의 문제점 🪓

#### 1. over fetching

```json
{
  "avatar": {
    "gravatar": {
      "hash": "c9e9fc152ee756a900db85757c29815d"
    }
  },
  "id": 548,
  "iso_639_1": "en",
  "iso_3166_1": "CA",
  "name": "Travis Bell",
  "include_adult": true,
  "username": "travisbell"
  .
  .
  .
}

```

쓰던 말던 너무 많은 데이터를 받는 것.<br>
rest는 선택권 없이 모든 데이터를 받아와야한다. -> 전송시간이 더 오래걸림.

**graphQl을 이용하면 필요한 데이터만 가져올 수 있다.**

<br>

#### 2. under fetching

```json
{
  "movie_id": 548,
  "iso_639_1": "en",
  "iso_3166_1": "CA",
  "movie_name": "harry potter",
  "include_adult": true,
  "username": "travisbell",
  "genreId": [1, 22, 90]
  .
  .
  .
}

```

영화를 화면에 보여주기 위해 데이터를 받아왔다.<br>
genre를 보여주려고 했으나 위 response에는 직접적인 genre_name이 들어있지 않고<br>
genre_id만 있어서 또다른 url에 요청을 해야한다.

사용자에게 보여주기전에 두 url에 요청하는 이러한 방식은 좋지않다.<br>
심지어 3개의 요청을 해야할 수도 있다. -> 로딩 시간이 길어짐.

**graphql은 많은 resource를 한 요청으로 받을 수 있다.**

<br>

## graphQl

graphQl은 restApi의 문제점을 해결해준다.<br>
하나의 specification. 사양, 특성, 명세, 아이디어이기 때문에<br>
js, python, c등 다른 언어로 구현될 수 있다.

graphql을 구현한 서버, `Apollo server`를 사용해 볼 것이다.<br>
express로 만들어진 rest API를 graphql로 바꿔주고 싶다면<br>
서버를 많이 수정하지 않고 미들웨어만 추가시켜주면 된다.

<br>

---

## setting

```
npm init -y
npm i apollo-server graphql
npm i nodemon -D
```

package.json에서

1. script를 dev로 바꿔주고,

2. import 문법을 쓰기위해
   "type": "module"을 해주고 server.js에서 import.

```
npm run dev
```

server.js를 저장할 때 마다 nodemon이 서버를 재시작해준다.

그러나, 이제 아래의 에러발생.

`Error: Apollo Server requires either an existing schema, modules or typeDefs`

`apollo server는 존재하는 schema, modules or typeDefs를 필요로 합니다.`

이제 시작이다.

<br>

---

### graphQl이 data의 shape을 미리 알고 있어야 하기 때문.

```
/api/v1/tweets
/api/v1/users/:id
```

rest api는 많은 url들의 집합이다.

graphQl api는 많은 `type`들의 집합이다.<br>
graphQl server한테 data의 type을 설명해 줘야한다.<br>

(무슨 데이터를 return하는지, 어떤 data를 post할지,.)
