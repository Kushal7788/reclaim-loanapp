import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Verifier = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  let { checkId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [address, setAddress] = useState("");
  const [claimUrl, setClaimUrl] = useState(null);
  const [claimUrlCalled, setClaimUrlCalled] = useState(false);

  const postData = async () => {
    try {
      let url = `${apiUrl}/update/${checkId}`;

      let options = {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      };
      const res = await fetch(url, options);
      const data = await res.json();
      if (res.status === 201)
        setClaimUrl(data.url);
      else
        setClaimUrl(undefined);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}/fetch/${checkId}`);
      const data = await res.json();
      setData(data.data);
      if (data) {
        const new_data = data.data?.proofParams;
        if (new_data) {
          for (let ele of new_data) {
            if (ele?.name)
              setName(ele.name);
            if (ele?.mobile)
              setMobile(ele.mobile);
            if (ele?.uid)
              setAadhar(ele.uid);
            if (ele?.address)
              setAddress(ele.address);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const goHome = () => {
    navigate(`/`);
  };

  useEffect(() => {
    if (claimUrl === undefined)
      postData();
    if (claimUrl === null && !claimUrlCalled) {
      setClaimUrlCalled(true);
      postData();
    }
  }, [claimUrl]);

  useEffect(() => {
    setInterval(fetchData, 5000);
  }, []);

  return (
    <div className="">
      <Toaster />
      <header class="text-gray-600 body-font border ">
        <div class="container mx-auto flex flex-wrap justify-between p-5 flex-col md:flex-row items-center">
          <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <img
              src="https://assets.website-files.com/63f580596efa74629ceecdf5/646cd0d4bff811689094709c_Reclaim-Logo-Asterisk.jpg"
              class="w-10 h-10 rounded-full"
            />

            <span class="ml-3 font-bold text-xl">Identity Data</span>
          </a>
          <a href="https://www.reclaimprotocol.org/">
            <button class="inline-flex cursor-pointer items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
              🔗 Reclaim Protocol
            </button>
          </a>
        </div>
      </header>

      <div className="flex my-14">
        <section class="mt-4 text-gray-600 p-3 h-full md:flex flex-row gap-4 w-full body-font ">
          <div class="container mx-auto   rounded-lg flex h-full p-3 items-center justify-center flex-col">
            <div class="text-center s lg:w-2/3 w-full">
              <p class="mb-8 leading-relaxed">
                Share this to person for validating their Indentity
              </p>
            </div>
            {claimUrl !== null && claimUrl !== "" && claimUrl !== undefined && (
              <div className="flex flex-col justify-center items-center gap-4 text-center w-full mt-12">
                <p class="sm:text-3xl hidden md:block text-2xl font-medium title-font mb-4 text-gray-900">
                  Scan in Reclaim App
                </p>

                <QRCodeSVG className="hidden md:block" height={200} width={200} value={claimUrl} />
                <div className="flex-row p-5 rounded-lg  gap-4">
                  <button
                    onClick={() => handleCopyLink(claimUrl)}
                    class="inline-flex text-white bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg"
                  >
                    Copy Reclaim Magic Link ✨
                  </button>
                </div>
                <div className="flex-row p-5 rounded-lg  gap-4">
                  <button
                    onClick={() => goHome()}
                    class="inline-flex text-black bg-grey-900 border-0 py-2 px-6 focus:outline-none hover:bg-grey-600 rounded text-lg"
                  >
                    Home
                  </button>
                </div>
              </div>
            )}
          </div>

          <div class="container  px-5 py-10 mx-auto">
            <div class="flex flex-col text-center w-full">
              <h1 class="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
                Status
              </h1>
              <p class="lg:w-2/3 mx-auto  ">
                Get realtime update of Verification
              </p>
            </div>
            {!data && (
              <div class="bg-white p-2 sm:p-4 sm:h-64 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-5 select-none ">
                <div class="h-52 sm:h-full sm:w-72 rounded-xl bg-gray-200 animate-pulse"></div>
                <div class="flex flex-col flex-1 gap-5 sm:p-2">
                  <div class="flex flex-1 flex-col gap-3">
                    <div class="bg-gray-200 w-full animate-pulse h-14 rounded-2xl"></div>
                    <div class="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                    <div class="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                    <div class="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                    <div class="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                  </div>
                  <div class="mt-auto flex gap-3">
                    <div class="bg-gray-200 w-20 h-8 animate-pulse rounded-full"></div>
                    <div class="bg-gray-200 w-20 h-8 animate-pulse rounded-full"></div>
                    <div class="bg-gray-200 w-20 h-8 animate-pulse rounded-full ml-auto"></div>
                  </div>
                </div>
              </div>
            )}

            {data && (
              <div class=" w-full mx-auto flex justify-center overflow-auto">
                <div class="flex flex-col text-xl  gap-4 w-full mt-5">
                  <div className="flex w-full justify-between p-4 rounded-xl border">
                    {" "}
                    <p className="capitalize font-bold">
                      {name ? "Verified Name ✅" : "Verifying Name ⌛️"}
                    </p>
                    <p>
                      {name ? (
                        <p className="font-bold"> {name}</p>
                      ) : (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span class="sr-only">Loading...</span>
                        </div>
                      )}
                    </p>
                  </div>
                  <div className="flex w-full justify-between p-4 rounded-xl border">
                    {" "}
                    <p className="capitalize font-bold">
                      {mobile ? "Verified Mobile No. ✅" : "Verifying Mobile No. ⌛️"}
                    </p>
                    <p>
                      {mobile ? (
                        <p className="font-bold"> {mobile}</p>
                      ) : (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span class="sr-only">Loading...</span>
                        </div>
                      )}
                    </p>
                  </div>
                  <div className="flex w-full justify-between p-4 rounded-xl border">
                    {" "}
                    <p className="capitalize font-bold">
                      {aadhar ? "Verified Aadhar No. ✅" : "Verifying Aadhar ⌛️"}
                    </p>
                    <p>
                      {aadhar ? (
                        <p className="font-bold"> {aadhar}</p>
                      ) : (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span class="sr-only">Loading...</span>
                        </div>
                      )}
                    </p>
                  </div>
                  <div className="flex w-full justify-between p-4 rounded-xl border">
                    {" "}
                    <p className="capitalize font-bold">
                      {address ? "Verified Address ✅" : "Verifying Address ⌛️"}
                    </p>
                    <p>
                      {address ? (
                        <p className="font-bold"> {address}</p>
                      ) : (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span class="sr-only">Loading...</span>
                        </div>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <footer class="text-gray-600 fixed w-full m-auto hidden md:block  bottom-0  body-font">
        <div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <img
              class="w-10 h-10 rounded-full"
              src="https://assets.website-files.com/63f580596efa74629ceecdf5/646cd0d4bff811689094709c_Reclaim-Logo-Asterisk.jpg"
            />
            <span class="ml-3 text-xl">Powered by Reclaim</span>
          </a>
          <p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            Identity Data
          </p>
          <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <a
              href="https://twitter.com/protocolreclaim"
              class="ml-3 text-gray-500"
            >
              <svg
                fill="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
};
