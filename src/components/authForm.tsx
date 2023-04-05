import { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";
import Image from "next/image";
import jwt from "jsonwebtoken";

const countries = [
  { label: "Estonia", value: "EE" },
  { label: "Lithuania", value: "LT" },
  { label: "Latvia", value: "LV" },
];

const AuthenticatePage = () => {
  const [nationalIdentityNumber, setNationalIdentityNumber] = useState("");
  const [countryCode, setCountryCode] = useState("EE");
  const [authUser, setAuthUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [userData, setUserData] = useState({
    success: false,
    user: {
      firstName: "",
      lastName: "",
      pid: "",
    },
  });

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    setAuthUser(true);
    if (token) {
      const decodedToken: any = jwt.decode(token);
      setUserData({
        user: {
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          pid: decodedToken.sub
            .replace("PNOEE-", "")
            .replace("PNOLV-", "")
            .replace("PNOLT-", ""),
        },
        success: true,
      });
    } else {
      setAuthUser(false);
    }
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nationalIdentityNumber,
          countryCode,
        }),
      });

      const { result } = await response.json();
      localStorage.setItem("token", result.token);
      setAuthUser(true);
      window.location.reload();
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div>
      {loading && (
        <div className="flex justify-center align-center items-center h-screen w-screen">
          <MoonLoader color={"#123abc"} loading={loading} size={50} />
        </div>
      )}
      {!authUser && !loading && userData.success === false && (
        <div>
          <div className="h-screen bg-cyan-500 flex justify-center items-center ">
            <form
              onSubmit={handleSubmit}
              className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20"
            >
              <div>
                <div className="justify-center flex mb-10 cursor-pointer">
                  <Image
                    src="https://www.smart-id.com/wordpress/wp-content/uploads/2021/11/smart_id_logo_title.svg"
                    alt="logo"
                    height={150}
                    width={150}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="National Identity Number"
                  value={nationalIdentityNumber}
                  onChange={(e) => setNationalIdentityNumber(e.target.value)}
                  className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
                />
                <select
                  placeholder="Country"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
                >
                  {countries.map((country) => (
                    <option
                      key={country.value}
                      value={country.value}
                      label={country.label}
                    >
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>
              {error && <h3>Error Authenticating</h3>}
              <div className="text-center mt-6">
                <button
                  type="submit"
                  disabled={nationalIdentityNumber === "" || countryCode === ""}
                  className="py-3 w-64 text-xl text-white bg-cyan-500 rounded-2xl"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {authUser && !loading && userData.success === true && (
        <div>
          <div className="flex items-center justify-center h-screen bg-gradient-to-br from-neutral-500 to-neutral-800">
            <div className="bg-white font-semibold text-center rounded-3xl border shadow-lg p-10 max-w-xs">
              <Image
                className="mb-3 w-64 h-30 mx-auto"
                src="/uniply_logo.svg"
                alt="uniply_logo"
                width={200}
                height={200}
              />
              <h1 className="text-lg text-gray-700 mb-4">
                {" "}
                User Name: <br /> {userData.user.firstName}{" "}
                {userData.user.lastName}{" "}
              </h1>
              <h3 className="text-sm text-gray-500 ">
                {" "}
                User Identity Number: <br /> {userData.user.pid}{" "}
              </h3>
              <button
                onClick={logout}
                className="bg-neutral-600 px-8 py-2 mt-8 rounded-3xl text-gray-100 font-semibold uppercase tracking-wide"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthenticatePage;
