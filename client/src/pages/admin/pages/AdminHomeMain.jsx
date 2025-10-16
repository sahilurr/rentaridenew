

import {  LineChart, Button } from "../components";

import { earningData } from "../data/dummys.jsx";

const AdminHomeMain = () => {
  return (
    <div className="mt-12 ">
      {/* hero - productsIncome */}
      <div className="flex flex-wrap lg:flex-nowrap justify-center items-center lg:items-start">
        <div className=" dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 xl:w-full 2xl:w-80 p-8 pt-9 m-3  bg-hero-pattern bg-no-repeat bg-cover   bg-slate-50 xl:h-[250px] 2xl:h-44">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-400">Earnings</p>
              <p className="text-2xl text-black">$63,448.78</p>
            </div>
          </div>

          <div className="mt-6">
            <Button
              color="white"
              bgColor="blue"
              text="Download"
              borderRadius="10px"
              size="md"
            />
          </div>
        </div>

        <div className="flex m-3 flex-wrap  justify-center xl:justify-start  gap-1 items-center ">
          {earningData.map((item) => (
            <div
              key={item.title}
              className="bg-slate-50 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt9 rounded-2xl 2xl:h-44"
            >
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-2xl opacity-0.9 "
              >
                {item.icon}
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold text-black">
                  {item.amount}
                </span>
                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>
              </p>
              <p className="text-sm text-gray-400 mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* graphs */}

      <div className="flex gap-10 m-4 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
          <div className="flex justify-between items-center gap-2">
            <p className="text-xl font-semibold">Recent Transactions</p>
            {/* <DropDown currentMode={currentMode} /> */}
          </div>
          <div className="mt-10 w-72 md:w-400">
           
          </div>
          <div className="flex justify-between items-center mt-5 border-t-1 border-color">
            <div className="mt-3">
              <Button
                color="white"
                // bgColor={currentColor}
                text="Add"
                borderRadius="10px"
              />
            </div>

            <p className="text-gray-400 text-sm">36 Recent Transactions</p>
          </div>
        </div>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
          <div className="flex justify-between items-center gap-2 mb-10">
            <p className="text-xl font-semibold">Sales Overview</p>
            {/* <DropDown currentMode={currentMode} /> */}
          </div>
          <div className="md:w-full overflow-auto">
            <LineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomeMain;
