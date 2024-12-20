# SNS + 실시간 채팅
SNS기능과 DM과 같은 채팅기능을 구현하였습니다.
- 배포페이지(expo) : [expo qrcode](https://expo.dev/preview/update?message=Feat%20%3A%20calendar%20%EC%88%98%EC%A0%95%2C%20css%EC%88%98%EC%A0%95&updateRuntimeVersion=1.0.0&createdAt=2024-11-12T02%3A49%3A12.555Z&slug=exp&projectId=f50fe54f-f5dd-4cec-af23-8f55c43bb63f&group=ca108ee9-9af5-4956-8661-3e6cb0270482)

# 기술스택
- React-native, Zustand, Typescript, Socket.io, Supabase, Express.js, aws-ec2

<br>

 <img width="400" alt="image" src="https://github.com/user-attachments/assets/15588266-77f3-40d6-89db-9761d4113775">


# 구현내역

- supabase의 realtime 이벤트를 이용하여 실시간 업데이트 구현
- Socket.io를 사용하여 실시간 통신 구현
- flatlist를 사용하여 무한 스크롤 기능 구현
- 캘린더 기능으로 날짜별 게시글 확인가능
- richeditor로 에디터구현
- supabase database를 이용해서 데이터 저장
- AWS-EC2에 express서버를 구동하여 socket.io의 실시간 채팅을 가능하게 함
