import AuthorizeSecLeft_V02 from "@/components/Home/home-v02/authorize-sec-leftv-02";
import AuthorizeSecRight_V02 from "@/components/Home/home-v02/authorize-sec-right-v02";
import { SEARCH_RESULTS } from "@/utlis/searchData-v02";

const AuthorizedHomePage_V02 = () => {
  return (
    <div className="flex md:flex-row flex-col">
      {/* 1st section */}
      <div className="md:w-3/4">
        <AuthorizeSecLeft_V02 SEARCH_RESULTS={SEARCH_RESULTS} />
      </div>
      <div className="flex-grow md:block hidden">
        <AuthorizeSecRight_V02 />
      </div>

      {/* 2nd section */}
    </div>
  );
};

export default AuthorizedHomePage_V02;
