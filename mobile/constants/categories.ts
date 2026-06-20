const categories = [
  {
    name: "Top Charts",
    code: "all",
    image: require("@/assets/images/categories/Top_Charts.png")
  },
  {
    name: "Business",
    code: "1321",
    image: require("@/assets/images/categories/Business.png"),
    subGenres: [
      {name: "Careers", code: "1410"},
      {name: "Investing", code: "1412"},
      {name: "Management", code: "1491"},
      {name: "Entrepreneurship", code: "1493"},
      {name: "Marketing", code: "1492"},
    ]
  },
  {
    name: "News",
    code: "1489",
    image: require("@/assets/images/categories/News.png"),
    subGenres: [
      {name: "Business News", code: "1490"},
      {name: "Daily News", code: "1526"},
      {name: "Entertainment News", code: "1531"},
      {name: "Politics", code: "1521"},
    ]
  },
  {
    name: "Education",
    code: "1304",
    image: require("@/assets/images/categories/Education.png"),
    subGenres: [
      {name: "Courses", code: "1501"},
      {name: "How To", code: "1499"},
      {name: "Language Learning", code: "1498"},
      {name: "Self-Improvement", code: "1500"},
    ]
  },
  {
    name: "Arts",
    code: "1301",
    image: require("@/assets/images/categories/Arts.png"),
    subGenres: [
      {name: "Design", code: "1482"},
      {name: "Books", code: "1402"},
      {name: "Fashion & Beauty", code: "1459"},
      {name: "Performing Arts", code: "1405"},
    ]
  },
  {
    name: "Comedy",
    code: "1303",
    image: require("@/assets/images/categories/Comedy.png"),
    subGenres: [
      {name: "Comedy Interviews", code: "1496"},
      {name: "Improv", code: "1495"},
      {name: "Stand-Up", code: "1497"},
    ]
  },
  {
    name: "Technology",
    code: "1318",
    image: require("../assets/images/categories/Technology.png")
  },
  {
    name: "History",
    code: "1487",
    image: require("@/assets/images/categories/History.png")
  },
  {
    name: "True Crime",
    code: "1488",
    image: require("@/assets/images/categories/True_Crime.png")
  },
  {
    name: "Health & Fitness",
    code: "1512",
    image: require("@/assets/images/categories/Health.png"),
    subGenres: [
      {name: "Alternative Health", code: "1513"},
      {name: "Fitness", code: "1514"},
      {name: "Mental Health", code: "1517"},
      {name: "Medicine", code: "1518"},
      {name: "Nutrition", code: "1515"}
    ]
  },
  {
    name: "Books",
    code: "1482",
    image: require("@/assets/images/categories/Books.png")
  },
  {
    name: "Sports",
    code: "1316",
    image: require("@/assets/images/categories/Sports.png"),
    subGenres: [
      {name: "Baseball", code: "1549"},
      {name: "Basketball", code: "1548"},
      {name: "Football", code: "1547"},
      {name: "Cricket", code: "1554"},
    ]
  },
  {
    name: "Science",
    code: "1533",
    image: require("@/assets/images/categories/Science.png"),
    subGenres: [
      {name: "Astronomy", code: "1538"},
      {name: "Chemistry", code: "1539"},
      {name: "Earth Science", code: "1540"},
      {name: "Mathematics", code: "1536"},
      {name: "Physics", code: "1542"}
    ]
  },
  {
    name: "Entreprenurship",
    code: "1493",
    image: require("@/assets/images/categories/Entrepreneurship.png")
  },
  {
    name: "Fiction",
    code: "1483",
    image: require("@/assets/images/categories/Fiction.png"),
    subGenres: [
      {name: "Comedy Fiction", code: "1486"},
      {name: "Drama", code: "1484"},
      {name: "Science Fiction", code: "1485"},
    ]
  },
  {
    name: "TV & Flim",
    code: "1309",
    image: require("@/assets/images/categories/TV&Film.png"),
    subGenres: [
      {name: "After Shows", code: "1562"},
      {name: "Film History", code: "1564"},
      {name: "Film Interviews", code: "1565"},
      {name: "Film Reviews", code: "1563"},
    ]
  }
];

export default categories