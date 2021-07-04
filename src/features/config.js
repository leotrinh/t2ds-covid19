//Application global config
const appUrl = "https://covid-19.tinhtd.info/";
const apiConfig = {
  dataEndpoint:
    "https://api.apify.com/v2/key-value-stores/ZsOpZgeg7dFS1rgfM/records/LATEST",
  cityEndpoint:
    "https://api.apify.com/v2/key-value-stores/p3nS2Q9TUn6kUOriJ/records/LATEST",
};
const aCityMaps = [
  {
    name: "bắc-giang",
    familyName: "Bắc Giang",
    cityId: "24",
  },
  {
    name: "hồ-chí-minh",
    familyName: "Hồ Chí Minh",
    cityId: "79",
  },
  {
    name: "bắc-ninh",
    familyName: "Bắc Ninh",
    cityId: "27",
  },
  {
    name: "hải-dương",
    familyName: "Hải Dương",
    cityId: "30",
  },
  {
    name: "hà-nội",
    familyName: "Hà Nội",
    cityId: "01",
  },
  {
    name: "đà-nẵng",
    familyName: "Đà Nẵng",
    cityId: "48",
  },
  {
    name: "bà-rịa-vũng-tàu",
    familyName: "Bà Rịa Vũng Tàu - BRVT",
    cityId: "77",
  },
  {
    name: "quảng-nam",
    familyName: "Quảng Nam",
    cityId: "49",
  },
  {
    name: "bình-dương",
    familyName: "Bình Dương",
    cityId: "74",
  },
  {
    name: "vĩnh-phúc",
    familyName: "Vĩnh Phúc",
    cityId: "26",
  },
  {
    name: "lạng-sơn",
    familyName: "Lạng Sơn",
    cityId: "20",
  },
  {
    name: "hà-tĩnh",
    familyName: "Hà Tĩnh",
    cityId: "42",
  },
  {
    name: "quảng-ninh",
    familyName: "Quảng Ninh",
    cityId: "22",
  },
  {
    name: "tây-ninh",
    familyName: "Tây Ninh",
    cityId: "72",
  },
  {
    name: "hưng-yên",
    familyName: "Hưng Yên",
    cityId: "33",
  },
  {
    name: "kiên-giang",
    familyName: "Kiên Giang",
    cityId: "91",
  },
  {
    name: "thái-bình",
    familyName: "Thái Bình",
    cityId: "34",
  },
  {
    name: "điện-biên",
    familyName: "Điện Biên",
    cityId: "11",
  },
  {
    name: "hà-nam",
    familyName: "Hà Nam",
    cityId: "35",
  },
  {
    name: "bạc-liêu",
    familyName: "Bạc Liêu",
    cityId: "95",
  },
  {
    name: "ninh-bình",
    familyName: "Ninh Bình",
    cityId: "37",
  },
  {
    name: "hòa-bình",
    familyName: "Hòa Bình",
    cityId: "17",
  },
  {
    name: "nghệ-an",
    familyName: "Nghệ An",
    cityId: "40",
  },
  {
    name: "cần-thơ",
    familyName: "Cần Thơ",
    cityId: "92",
  },
  {
    name: "đồng-tháp",
    familyName: "Đồng Tháp",
    cityId: "87",
  },
  {
    name: "thanh-hóa",
    familyName: "Thanh Hóa",
    cityId: "38",
  },
  {
    name: "nam-định",
    familyName: "Nam Định",
    cityId: "36",
  },
  {
    name: "an-giang",
    familyName: "An Giang",
    cityId: "89",
  },
  {
    name: "sóc-trăng",
    familyName: "Sóc Trăng",
    cityId: "94",
  },
  {
    name: "vĩnh-long",
    familyName: "Vĩnh Long",
    cityId: "86",
  },
  {
    name: "quảng-trị",
    familyName: "Quảng trị",
    cityId: "45",
  },
  {
    name: "hải-phòng",
    familyName: "Hải Phòng",
    cityId: "31",
  },
  {
    name: "trà-vinh",
    familyName: "Trà Vinh",
    cityId: "84",
  },
  {
    name: "thái-nguyên",
    familyName: "Thái Nguyên",
    cityId: "19",
  },
  {
    name: "cà-mau",
    familyName: "Cà Mau",
    cityId: "96",
  },
  {
    name: "phú-thọ",
    familyName: "Phú Thọ",
    cityId: "25",
  },
  {
    name: "quảng-ngãi",
    familyName: "Quảng Ngãi",
    cityId: "51",
  },
  {
    name: "thừa-thiên-huế",
    familyName: "Thừa Thiên Huế",
    cityId: "46",
  },
  {
    name: "yên-bái",
    familyName: "Yên Bái",
    cityId: "15",
  },
  {
    name: "lào-cai",
    familyName: "Lào Cai",
    cityId: "10",
  },
  {
    name: "hà-giang",
    familyName: "Hà Giang",
    cityId: "02",
  },
  {
    name: "tuyên-quang",
    familyName: "Tuyên Quang",
    cityId: "08",
  },
  {
    name: "lai-châu",
    familyName: "Lai Châu",
    cityId: "12",
  },
  {
    name: "sơn-la",
    familyName: "Sơn La",
    cityId: "14",
  },
  {
    name: "bình-định",
    familyName: "Bình Định",
    cityId: "52",
  },
  {
    name: "lâm-đồng",
    familyName: "Lâm Đồng",
    cityId: "68",
  },
  {
    name: "bình-phước",
    familyName: "Bình Phước",
    cityId: "70",
  },
  {
    name: "?ông-nam-b?",
    familyName: "Đông Nam Bộ",
    cityId: "vn-331",
  },
  {
    name: "hậu-giang",
    familyName: "Hậu Giang",
    cityId: "93",
  },
  {
    name: "quảng-bình",
    familyName: "Quảng Bình",
    cityId: "44",
  },
  {
    name: "đắk-nông",
    familyName: "Đắk Nông",
    cityId: "67",
  },
  {
    name: "kon-tum",
    familyName: "Kontum",
    cityId: "62",
  },
  {
    name: "cao-bằng",
    familyName: "Cao Bằng",
    cityId: "04",
  },
  {
    name: "?ông-b?c",
    familyName: "Đông Bắc",
    cityId: "vn-307",
  },
  {
    name: "hoàng-sa",
    familyName: "Hoàng Sa",
    cityId: "hs01",
  },
  {
    name: "trường-sa",
    familyName: "Trường Sa",
    cityId: "truongsa",
  },
  {
    name: "bến-tre",
    familyName: "Bến Tre",
    cityId: "83",
  },
  {
    name: "tiền-giang",
    familyName: "Tiền Giang",
    cityId: "82",
  },
  {
    name: "long-an",
    familyName: "Long An",
    cityId: "80",
  },
  {
    name: "phú-yên",
    familyName: "Phú Yên",
    cityId: "54",
  },
  {
    name: "gia-lai",
    familyName: "Gia Lai",
    cityId: "64",
  },
  {
    name: "đắk-lắk",
    familyName: "Đắk Lắk",
    cityId: "66",
  },
  {
    name: "ninh-thuận",
    familyName: "Ninh Thuận",
    cityId: "58",
  },
  {
    name: "khánh-hòa",
    familyName: "Khánh Hòa",
    cityId: "56",
  },
  {
    name: "bình-thuận",
    familyName: "Bình Thuận",
    cityId: "60",
  },
];
