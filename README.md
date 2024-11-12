# SNS + 실시간 채팅
SNS기능과 DM과 같은 채팅기능을 구현하였습니다.
- 배포페이지(expo) : [expo qrcode](https://expo.dev/preview/update?message=Feat%20%3A%20calendar%20%EC%88%98%EC%A0%95%2C%20css%EC%88%98%EC%A0%95&updateRuntimeVersion=1.0.0&createdAt=2024-11-12T02%3A49%3A12.555Z&slug=exp&projectId=f50fe54f-f5dd-4cec-af23-8f55c43bb63f&group=ca108ee9-9af5-4956-8661-3e6cb0270482)

# 기술스택
- React-native, Zustand, Typescript, Socket.io, Supabase, Express.js, aws-ec2

# 구현내역

- SNS실시간 업데이트
  - supabase의 realtime 이벤트를 이용하여 실시간 업데이트 구현
- DM 채팅
  - Socket.io를 사용하여 실시간 통신 구현
-  게시글 필터 
  - 캘린더 기능으로 날짜별 게시글 확인가능
