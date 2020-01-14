import { StyleSheet } from "react-native";
// pantone acquamarine 4ec5a5
// coral color f5fcff
const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    backgroundColor: "#f5fcff"
  },
  topBar: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 6,
    backgroundColor: "#4ec5a5"
  },
  heading: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
    color: "#fff"
  },
  enableInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  listContainer: {
    borderColor: "#ccc",
    borderTopWidth: 0.5
  },
  listItem: {
    flex: 1,
    height: "auto",
    paddingHorizontal: 16,
    borderColor: "#ccc",
    borderBottomWidth: 0.5,
    justifyContent: "center",
    paddingTop: 15,
    paddingBottom: 15
  },
  listItemStatus: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
    fontWeight: "bold",
    fontSize: 12,
    color: "#fff"
  },
  footer: {
    height: 52,
    borderTopWidth: 1,
    borderTopColor: "#999"
  },
  fixedFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  buttonView: {
    height: 600,
    margin: 5,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  startButton: {
    backgroundColor: 'red'
  },
  buttonText: {
    color: "#22509d",
    fontWeight: "bold",
    fontSize: 14
  },
  buttonRaised: {
    backgroundColor: "#22509d",
    borderRadius: 2,
    elevation: 2
  },

  // dashboard
  dashboardStat: {
    width: 300,
    height: 300,
    borderColor: 'lightgrey',
    marginVertical: 8,
    borderRadius: 16,
    borderWidth:1
  }
});

export default styles;
