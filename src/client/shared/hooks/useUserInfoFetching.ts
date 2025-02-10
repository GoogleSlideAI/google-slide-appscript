import { useEffect, useState } from "react";
import { useAppStore, UserInfo } from "../stores";
import { serverFunctions } from "../../utils/serverFunctions";
import { useServerFunction } from "./useServerFunction";

export const useUserInfoFetching = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { isLoading, execute } = useServerFunction<any>();

  
  const { userInfo, setUserInfo } = useAppStore((state) => ({
    userInfo: state.userInfo,
    setUserInfo: state.setUserInfo,
  }));

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // If no user info in local storage, fetch from Apps Script
        if (!userInfo) {
          // Get user info from Apps Script
          const appsScriptUserInfo =  execute(() => serverFunctions.getUserInfo());
          console.log(appsScriptUserInfo);
          
          // Sign in to backend with user email
          // const signInResponse = await signIn({
          //   email: appsScriptUserInfo.email,
          //   username: appsScriptUserInfo.name
          // });

          // setIsSuccess(signInResponse);


          setUserInfo(appsScriptUserInfo as unknown as UserInfo);
        }


        setIsSuccess(true);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setIsSuccess(false);
      } finally {
      }
    };

    fetchUserInfo();
  }, [userInfo, setUserInfo]);

  return { isLoading, isSuccess };
};

