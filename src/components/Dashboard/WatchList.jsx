import React, { useState, useEffect } from "react";
import fetchCurrentPrice from "../../../pyserver/MakeRequest/getStockCurrentPrice";
import { symbolMapping } from "../../data/Symbol";
import { useSelector } from "react-redux";
import Loader from '../Loader'

const wlist = [
    "RELIANCE",
    "TCS",
    "HDFCBANK",
    "INFY",
    "ICICIBANK",
    "SBIN",
    "HINDUNILVR",
    "AXISBANK",
    "BAJFINANCE",
    "MARUTI",
];

const WatchList = () => {
    const { user } = useSelector((state) => state.profile);

    const [watchlistData, setWatchlistData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        console.log("calling");
        try {
            setLoading(true);
            setError(null);

            const listToFetch = user.watchList.length > 0 ? user.watchList : wlist;
            const promises = listToFetch.map(async (symbol) => {
                const data = await fetchCurrentPrice(symbol);
                const change = parseFloat(data.change).toFixed(2);
                const pChange = parseFloat(data.pChange).toFixed(2);

                const symbolData = symbolMapping.find(
                    (item) => item.SYMBOL === symbol
                );
                const companyName = symbolData ? symbolData.COMPANY_NAME : "";

                return {
                    ...data,
                    symbol: symbol,
                    companyName: companyName,
                    change: change,
                    pChange: pChange,
                };
            });
            const newData = await Promise.all(promises);

            newData.sort(
                (a, b) => parseFloat(b.pChange) - parseFloat(a.pChange)
            );

            setWatchlistData(newData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refreshData = () => {
        fetchData();
    };

    if(loading){
        return (<div className="flex flex-row items-center justify-between mx-auto"><Loader/></div>)
    }

    return (
        <div className="mx-auto w-1/2">
            <div className="p-1 rounded-md border-black border-[1px] my-2 flex flex-col items-center">
                <div className="font-bold text-3xl underline my-2 ">
                    Watchlist
                </div>
                <div className="w-full flex flex-col items-center">
                    <table className="w-3/4">
                        <thead>
                            <tr className="text-[#808080] text-left font-semibold text-lg">
                                <th className="text-center">Company</th>
                                <th className="text-center">Value</th>
                                <th className="text-center">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {watchlistData.map((item, index) => (
                                <tr key={index} className="mb-8 border text-center">
                                    <td>
                                        <div className="font-bold">
                                            {item.symbol}
                                        </div>
                                        <div>{item.companyName}</div>{" "}
                                    </td>
                                    <td>{item.lastPrice}</td>
                                    <td>
                                        <div
                                            className={`text-center font-bold ${
                                                parseFloat(item.pChange) > 0
                                                    ? "text-[#008000]"
                                                    : parseFloat(item.pChange) <
                                                      0
                                                    ? "text-[#FF0000]"
                                                    : "text-[#808080]"
                                            }`}
                                        >
                                            <div>{item.change}</div>
                                            <div>{item.pChange}%</div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="text-center py-2 bg-theme w-3/4">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={refreshData}
                    >
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WatchList;
