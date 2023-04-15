"/" : Check login true move to "/" page if not move to "/create-account" page, After logging in, in the Home page, the user should see all the Tweets on the database, the user should also be able to POST a Tweet.
"/create-account": create-accout;
"/log-in": login;
"/tweet/[id]": detail tweet page, The user should be able to see the tweet + a Like button. When the Like button is pressed, save the like on the databases and reflect the update using mutate from useSWR

database SQLite base prisam
schema change npm run db-sync

swr tailwind useForm

Prisma 데이터 모델 작성 시 Relation을 활용하세요.
Relation 공식 문서 https://swr.vercel.app/ko/docs/data-fetching
API를 통하여 값을 받아오고 싶을떈 useSWR을 사용합니다.
SWR 공식 문서 https://developer.mozilla.org/ko/docs/Web/API/Fetch_API/Using_Fetch
API에 값을 전달하고 싶을땐 fetch API를 사용합니다.
fetch API 공식 문서 https://developer.mozilla.org/ko/docs/Web/API/Fetch_API/Using_Fetch
로그인을 완료했을 경우 iron-session을 사용하여 로그인 정보를 저장 할 수 있습니다.
페이지를 이동하고 싶을땐 useRouter훅을 사용하여 리다이렉션을 할 수 있습니다.
useRouter 공식 문서 https://nextjs.org/docs/api-reference/next/router
react-hook-form의 watch 함수를 사용하여 사용자가 값을 모두 입력하지 않았을 경우 버튼을 비활성화 할 수 있습니다.
watch 공식 문서 https://react-hook-form.com/api/useform/watch
try-catch 구문과 setError함수를 사용하면 API에서 오류가 발생했을 경우 원하는 오류 문구를 출력 할 수 있습니다.
setError 공식 문서 https://react-hook-form.com/api/useform/seterror
트윗 상세페이지를 구현할땐 useRouter의 query 객체를 활용합니다.
router 객체 공식 문서 https://nextjs.org/docs/api-reference/next/router#router-object
useRef를 활용하면 페이지 로딩이 완료된 후 특정 코드를 실행할 수 있습니다.
useRef 공식 문서 https://ko.reactjs.org/docs/hooks-reference.html#useref
