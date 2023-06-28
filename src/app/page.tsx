"use client";
import React, { useEffect, useState, useRef, RefObject } from "react";
import classNames from "classnames/bind";
import { FaGripLines, FaPencil, FaTrashCan, FaRegCircleCheck, FaArrowUp } from "react-icons/fa6";

import styles from "./page.module.scss";
import { metadata } from "./layout";
import lsApi from "./data-faker/ls-api.json";

const cx = classNames.bind(styles);

interface item {
    title: string;
    isDone: boolean;
}

export default function Home() {
    metadata.title = "7V | TD-List ";

    const [list, setList] = useState<item[]>(lsApi.map((item) => item));
    const [newItem, setNewItem] = useState<item>({
        title: "",
        isDone: false,
    });

    const [idEdit, setIdEdit] = useState<number>(-1);

    const [amountItem, setAmountItem] = useState<number>(list.length);

    const [itemRefs, setItemRefs] = useState<RefObject<HTMLLIElement>[]>(
        Array(amountItem)
            .fill(null)
            .map(() => useRef<HTMLLIElement>(null)),
    );

    const [doneBtnRefs, setDoneBtnRefs] = useState<RefObject<HTMLDivElement>[]>(
        Array(amountItem)
            .fill(null)
            .map(() => useRef<HTMLDivElement>(null)),
    );

    const [dragItemIndex, setDragItemIndex] = useState<number>(-1);
    const [dragOverItemIndex, setDragOverItemIndex] = useState<number>(-1);

    const HandleAdd = (act: string = "add", index: number = -1) => {
        if (act != "add" && index != -1) {
            const prevValue = list[index].title;
            setList((prevList) => {
                const newList = [...prevList];
                newList[index].title = newItem.title;
                return newList;
            });

            console.log(`Đã sửa "${prevValue}" thành "${newItem.title}".`);
            setIdEdit(-1);
            setNewItem({
                title: "",
                isDone: false,
            });
            return;
        }

        if (newItem.title !== "") {
            setList((prevItem) => [...prevItem, newItem]);
            setItemRefs((prevRefs) => [...prevRefs, React.createRef<HTMLLIElement>()]);
            setDoneBtnRefs((prevRefs) => [...prevRefs, React.createRef<HTMLDivElement>()]);
            console.log(`Đã thêm "${newItem.title}".`);
            setNewItem({
                title: "",
                isDone: false,
            });
        }
        return;
    };

    const HandleEdit = (index: number, _item: item) => {
        setNewItem(_item);
        setIdEdit(index);
    };

    const HandleDel = (index: number) => {
        setList((prevList) => {
            alert(`Xóa "${prevList[index]}"!`);
            console.log(`Đã xóa "${prevList[index].title}".`);
            const newList = [...prevList];
            newList.splice(index, 1);
            return newList;
        });
        setItemRefs((prevRefs) => {
            const newItemRefs = [...prevRefs];
            newItemRefs.splice(index, 1);
            return newItemRefs;
        });
        setDoneBtnRefs((prevRefs) => {
            const newItemRefs = [...prevRefs];
            newItemRefs.splice(index, 1);
            return newItemRefs;
        });
    };

    const HandleDone = (_item: item, isDone: boolean) => {
        setList((prevList) => {
            const newList = [...prevList];
            newList.forEach((item) => {
                if (item === _item) {
                    item.isDone = isDone;
                }
            });
            return newList;
        });
    };

    const HandleOnDragStart = (index: number) => {
        setDragItemIndex(index);
    };

    const HandleOnDragOver = (e: any) => {
        e.preventDefault();
    };

    const HandleOnDrop = () => {
        const _list = [...list];
        const _item: item = _list.splice(dragItemIndex, 1)[0];
        _list.splice(dragOverItemIndex, 0, _item);
        setList(_list);
    };

    const HandleOnDragEnter = (e: any, index: number) => {
        setDragOverItemIndex(index);
    };

    const HandleOnDragLeave = (e: any) => {
        setDragOverItemIndex(-1);
    };

    const HandleOnDragEnd = () => {
        setDragItemIndex(-1);
        setDragOverItemIndex(-1);
    };

    return (
        <main className={cx("main")}>
            <div className={cx("container")}>
                <code className={cx("head-title")}>TODO LIST -- HELLO WORLD!</code>
                <ul className={cx("description")}>
                    {(list.length > 0 &&
                        list
                            .map((_item, index) => {
                                return (
                                    <li
                                        key={index}
                                        className={cx("item", `item${index}`, _item.isDone && "item-done")}
                                        ref={itemRefs[index]}
                                        draggable
                                        onDragStart={() => HandleOnDragStart(index)}
                                        onDragOver={(e) => HandleOnDragOver(e)}
                                        onDrop={() => HandleOnDrop()}
                                        onDragLeave={(e) => HandleOnDragLeave(e)}
                                        onDragEnd={() => HandleOnDragEnd()}
                                    >
                                        <FaGripLines />
                                        <p className={cx("title")}>{_item.title}</p>
                                        <div className={cx("action")}>
                                            <p
                                                className={cx("icon", `icon${index}`)}
                                                onClick={() => HandleEdit(index, _item)}
                                                style={{ ["--color" as string]: "yellow" }}
                                            >
                                                <FaPencil />
                                            </p>
                                            <p
                                                className={cx("icon", `icon${index}`)}
                                                onClick={() => HandleDel(index)}
                                                style={{ ["--color" as string]: "red" }}
                                            >
                                                <FaTrashCan />
                                            </p>
                                            <p
                                                className={cx("icon", `icon${index}`, _item.isDone && "icon-done")}
                                                onClick={() => HandleDone(_item, !_item.isDone)}
                                                style={{ ["--color" as string]: "blue" }}
                                            >
                                                <FaRegCircleCheck />
                                            </p>
                                        </div>
                                        <div className={cx("overlay")} onDragEnter={(e) => HandleOnDragEnter(e, index)}></div>
                                    </li>
                                );
                            })
                            .reverse()) || (
                        <div className={cx("item")}>
                            <p>Thêm việc nào!</p>
                        </div>
                    )}
                </ul>
                <div className={cx("add-item")}>
                    <input
                        placeholder="Nhập ở đây..."
                        value={newItem.title}
                        onChange={(e) =>
                            setNewItem({
                                title: e.target.value,
                                isDone: false,
                            })
                        }
                        type="text"
                        name=""
                        id=""
                    />

                    <p
                        className={cx("icon")}
                        style={{ ["--color" as string]: "#00f1ad" }}
                        onClick={() => (idEdit != -1 ? HandleAdd("edit", idEdit) : HandleAdd())}
                    >
                        <FaArrowUp />
                    </p>
                </div>
            </div>
        </main>
    );
}
