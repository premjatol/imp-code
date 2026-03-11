import { useState, useEffect, useRef } from "react";

export const useSelectableList = (items = [], getId = (item) => item.id) => {
  const [selected, setSelected] = useState([]);
  const selectAllRef = useRef(null);

  const allSelected = items.length > 0 && selected.length === items.length;

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(items.map((item) => getId(item)));
    } else {
      setSelected([]);
    }
  };

  const toggleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    if (!selectAllRef.current) return;

    selectAllRef.current.indeterminate =
      selected.length > 0 && selected.length < items.length;
  }, [selected, items.length]);

  return {
    selected,
    allSelected,
    selectAllRef,
    toggleSelectAll,
    toggleSelectOne,
    setSelected,
  };
};
