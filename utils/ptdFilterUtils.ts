import { PTDItem } from "../types/ptd";

export function applyFiltersPTD(
  originalData: PTDItem[],
  activeFilters: any
): PTDItem[] {
  let filteredData = [...originalData];

  if (activeFilters.deviceName) {
    filteredData = filteredData.filter((item) =>
      item.deviceName
        .toLowerCase()
        .includes(activeFilters.deviceName.toLowerCase())
    );
  }
  // if (activeFilters.status) {
  //   filteredData = filteredData.filter(
  //     (item) => item.status === activeFilters.status
  //   );
  // }
  if (activeFilters.companyName) {
    filteredData = filteredData.filter((item) =>
      item.companyName
        .toLowerCase()
        .includes(activeFilters.companyName.toLowerCase())
    );
  }
  if (activeFilters.model) {
    filteredData = filteredData.filter((item) =>
      item.model.toLowerCase().includes(activeFilters.model.toLowerCase())
    );
  }
  if (activeFilters.serial) {
    filteredData = filteredData.filter(
      (item) => item.serial === activeFilters.serial
    );
  }
  if (activeFilters.dateFrom && activeFilters.dateTo) {
    filteredData = filteredData.filter((item) => {
      const [day, month, year] = item.date.split("/").map(Number);
      const itemDate = new Date(year, month - 1, day);
      return (
        itemDate >= activeFilters.dateFrom && itemDate <= activeFilters.dateTo
      );
    });
  } else if (activeFilters.dateFrom) {
    filteredData = filteredData.filter((item) => {
      const [day, month, year] = item.date.split("/").map(Number);
      const itemDate = new Date(year, month - 1, day);
      return itemDate >= activeFilters.dateFrom;
    });
  } else if (activeFilters.dateTo) {
    filteredData = filteredData.filter((item) => {
      const [day, month, year] = item.date.split("/").map(Number);
      const itemDate = new Date(year, month - 1, day);
      return itemDate <= activeFilters.dateTo;
    });
  }
  if (activeFilters.requirement) {
    filteredData = filteredData.filter(
      (item) => item.requirement === activeFilters.requirement
    );
  }
  if (activeFilters.receiveStatus) {
    filteredData = filteredData.filter(
      (item) => item.receiveStatus === activeFilters.receiveStatus
    );
  }
  if (activeFilters.returnStatus) {
    filteredData = filteredData.filter(
      (item) => item.returnStatus === activeFilters.returnStatus
    );
  }
  if (activeFilters.bbdStatus) {
    filteredData = filteredData.filter(
      (item) => item.bbdStatus === activeFilters.bbdStatus
    );
  }
  if (activeFilters.certificateNumber) {
    filteredData = filteredData.filter((item) =>
      item.certificateNumber
        .toLowerCase()
        .includes(activeFilters.certificateNumber.toLowerCase())
    );
  }
  if (activeFilters.sealNumber) {
    filteredData = filteredData.filter((item) =>
      item.sealNumber
        .toLowerCase()
        .includes(activeFilters.sealNumber.toLowerCase())
    );
  }

  return filteredData;
}

export function sortPTDData(
  data: PTDItem[],
  option: "newest" | "oldest" | null
): PTDItem[] {
  if (!option) return data;

  return [...data].sort((a, b) => {
    const dateA = a.date.includes("/")
      ? new Date(a.date.split("/").reverse().join("-"))
      : new Date(a.date);
    const dateB = b.date.includes("/")
      ? new Date(b.date.split("/").reverse().join("-"))
      : new Date(b.date);

    return option === "newest"
      ? dateB.getTime() - dateA.getTime()
      : dateA.getTime() - dateB.getTime();
  });
}