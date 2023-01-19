import React, { useEffect, useState } from "react";
import { ratesNames } from "../helpers/constants";
import styles from "./MainComponent.module.css"

const MainComponent = () => {
    const [dataFirst, setDataFirst] = useState({});
    const [dataSecond, setDataSecond] = useState({});
    const [dataThird, setDataThird] = useState({});
    const [newArray, setNewArray] = useState([]);
    const [minRateArr, setMinRateArr] = useState([]);


    const calcDataRow = (cur1, cur2) => {

        const objFirst = dataFirst["rates"];
        const objSecond = dataSecond["rates"];
        const objThird = dataThird["rates"];

        const object = {
            name: `${cur1}/${cur2}`,
            first: (objFirst[cur1] / objFirst[cur2]).toFixed(2),
            second: (objSecond[cur1] / objSecond[cur2]).toFixed(2),
            third: (objThird[cur1] / objThird[cur2]).toFixed(2),
        }

        const min = Math.min(
            Number(object.first),
            Number(object.second),
            Number(object.third),
        );
        return {
            object,
            min
        }
    }



    useEffect(() => {
        getFirst();
        getSecond();
        getThird();

        if (dataFirst["rates"] && dataSecond["rates"] && dataThird["rates"]) {
            const objFirst = dataFirst["rates"];
            const objSecond = dataSecond["rates"];
            const objThird = dataThird["rates"];
            const tempArr = [];
            const minRateTemp = [];

            // создаем массив объектов, где объект - содержимое для строки в таблице
            // также выбираем минимальные значения для каждой строки
            for (const name of ratesNames) {
                if (name === "RUB/USD") {
                    const dataRow = calcDataRow('RUB', 'USD');
                    tempArr.push(dataRow.object);
                    minRateTemp.push(dataRow.min);
                } else if (name === "RUB/EUR") {
                    const dataRow = calcDataRow('RUB', 'EUR');
                    tempArr.push(dataRow.object);
                    minRateTemp.push(dataRow.min);
                } else if (name === "EUR/USD") {
                    const dataRow = calcDataRow('EUR', 'USD');
                    tempArr.push(dataRow.object);
                    minRateTemp.push(dataRow.min);
                } else {
                    const object = {
                        name,
                        first: objFirst[`${name.slice(0, 3)}`].toFixed(2),
                        second: objSecond[`${name.slice(0, 3)}`].toFixed(2),
                        third: objThird[`${name.slice(0, 3)}`].toFixed(2),
                    };
                    const min = Math.min(Number(object.first), Number(object.second), Number(object.third));
                    tempArr.push(object);
                    minRateTemp.push(min);
                }
            }
            setNewArray(tempArr);
            setMinRateArr(minRateTemp);
        }
    }, [dataFirst, dataSecond, dataThird]);


    const baseUrl = "http://localhost:3000/api/v1";

    const getFirst = async () => {
        try {
            const response = await fetch(`${baseUrl}/first/poll`);
            const data = await response.json();
            setDataFirst(data);
            await getFirst();
        } catch (e) {
            setTimeout(() => {
                getFirst();
            }, 500);
        }
    };

    const getSecond = async () => {
        try {
            const response = await fetch(`${baseUrl}/second/poll`);
            const data = await response.json();
            setDataSecond(data);
            await getSecond();
        } catch (e) {
            setTimeout(() => {
                getSecond();
            }, 500);
        }
    };

    const getThird = async () => {
        try {
            const response = await fetch(`${baseUrl}/third/poll`);
            const data = await response.json();
            setDataThird(data);
            await getThird();
        } catch (e) {
            setTimeout(() => {
                getThird();
            }, 500);
        }
    };

    if (newArray.length > 0)
        return (
            <div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.header}>
                                Pair name/market
                            </th>
                            <th className={styles.header}>
                                First
                            </th>
                            <th className={styles.header}>
                                Second
                            </th>
                            <th className={styles.header}>
                                Third
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {newArray.map((item, i) => {
                            return (
                                <tr key={i}>
                                    {Object.values(newArray[i]).map((item2, index2) => {
                                        return (
                                            <td
                                                key={index2}
                                                className={index2 > 0 && Number(item2) === Number(minRateArr[i])
                                                    ?
                                                    styles.cellMin
                                                    :
                                                    styles.cell}
                                            >
                                                {item2}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
};

export default MainComponent