import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./AdminMenu.module.css";
import { IoLogOut } from "react-icons/io5";
import { logoutUser } from "../../Redux/Reducers/async thunk/AuthRequests";
const axios = require("axios");
const messagelist = [];

const UserMenu = (props) => {
  const [input, setInput] = useState("");
  const [type, setType] = useState("");
  const [alias, setAlias] = useState("");
  const [message, setMessage] = useState("");
  const [admin, changeAdmin] = useState("Admin");
  const [response, setResponse] = useState(null);
  const [view, changeView] = useState(0);
  const [report, setReport] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!props.authSlice.isAuthenticated) {
      navigate("/login");
    }
  });

  const handleLogout = async (e) => {
    await props.logoutUser();
    navigate("/");
  };
  const getReport = (e) => {
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
    };
    axios
      .get("http://localhost:5000/api/admin/getreport", { headers })
      .then((res) => {
        console.log(res.data);
        setType(res.data.report.reportType);
        setAlias(res.data.report.reportedAlias);
        setMessage(res.data.report.reportedMessage);
        console.log(type);
        console.log(alias);
      });
  };
  const moveView = (e) => {
    if (e && e.target.value) {
      changeView(e.target.value);
      console.log(e.target.value);
      if (e.target.value == 5) {
        getReport();
      }
    } else {
      changeView(0);
    }
  };

  const onChange = (e) => {
    setInput(e.target.value);
  };

  const clearReport = (e) => {
    if (e.target.value == 6) {
      const headers = {
        Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
      };
      axios
        .get("http://localhost:5000/api/admin/clearreport", { headers })
        .then(getReport());
    }
  };

  const deleteUser = (e) => {
    e.preventDefault();
    console.log(input);
    //put
    const body = { id: input };
    setInput("");
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
    };
    axios
      .put("http://localhost:5000/api/admin/deleteuser", body, { headers })
      .then((res) => {
        alert("User deleted");
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 404) {
          alert("User does not exist");
        }
      });
  };

  const blacklistUser = (e) => {
    console.log(input);
    //put
    const body = { id: input };
    setInput("");
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
    };
    axios
      .put("http://localhost:5000/api/admin/blacklist_tag", body, { headers })
      .then((res) => {
        console.log("helo");
        alert("User blacklisted");
      })
      .catch((error) => {
        alert(
          "Failed to blacklist tag: Invalid tag or tag already blacklisted"
        );
      });
  };

  const banUser = (e) => {
    e.preventDefault();
    console.log(input);
    //put
    const body = { id: input };
    setInput("");
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
    };
    axios
      .put("http://localhost:5000/api/admin/banuser", body, { headers })
      .then((res) => {
        alert("User banned");
      })
      .catch((error) => {
        alert("Failed to ban user: user already banned or doesn't exist");
      });
  };

  const clearChat = (e) => {
    e.preventDefault();
    console.log(input);
    //put
    const body = { id: input };
    setInput("");
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
    };
    axios
      .put("http://localhost:5000/api/admin/clearchat", body, { headers })
      .then((res) => {
        console.log(res);
        alert("Chat cleared");
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 404) {
          alert("Chat does not exist");
        }
      });
  };

  /*const exerciseAuthority = (e) => {
    const _id = e.target.value;
    const input_val = document.getElementById(_id).value;
    switch (e.target.value) {
      case "delete_user_input":
        console.log(`Banning user ${input_val}`);
        break;
      case "blacklist_tag_input":
        console.log(`Blacklisting tag ${input_val}`);
        break;
      case "ban_user_input":
        console.log(`Banning user ${input_val}`);
        break;
      case "clear_chatroom_input":
        console.log(`Clearing chatroom ${input_val}`);
        break;
    }
    moveView(null);
    alert("ACTION EXECUTED");
  };*/

  return (
    <div className={styles.body}>
      <div className={styles.admin_room_header}>
        <div className={styles.logout} onClick={handleLogout}>
          Log Out
          <IoLogOut className={styles.admin_room_header_item} />
        </div>
      </div>
      <div className={styles.menu_container}>
        {view == 0 && (
          <div className={styles.view_0}>
            <div className={styles.menu_title}>
              <h1>Admin</h1>
            </div>
            <ul className={styles.button_group}>
              <li className={styles.menu_button}>
                <Button value={1} onClick={moveView}>
                  Delete User
                </Button>
              </li>
              <li className={styles.menu_button}>
                <Button value={2} onClick={moveView}>
                  Blacklist Tag
                </Button>
              </li>
              <li className={styles.menu_button}>
                <Button value={3} onClick={moveView}>
                  Ban User
                </Button>
              </li>
              <li className={styles.menu_button}>
                <Button value={4} onClick={moveView}>
                  Clear Chatroom
                </Button>
              </li>
              <li className={styles.menu_button}>
                <Button value={5} onClick={moveView}>
                  View Reported Users
                </Button>
              </li>
            </ul>
          </div>
        )}
        {view == 1 && (
          <div className={styles.views}>
            <div className={styles.view_title}>
              <Button onClick={moveView}>
                <ArrowBackIcon />
              </Button>
              <h3>Delete User</h3>
            </div>
            <input
              id="delete_user_input"
              placeholder="User ID"
              value={input}
              onChange={onChange}
            ></input>
            <div className={styles.action_button}>
              <Button value="submit" onClick={deleteUser}>
                Delete
              </Button>
            </div>
          </div>
        )}
        {view == 2 && (
          <div className={styles.views}>
            <div className={styles.view_title}>
              <Button value={0} onClick={moveView}>
                <ArrowBackIcon />
              </Button>
              <h3>Blacklist Tag</h3>
            </div>

            <input
              id="blacklist_tag_input"
              placeholder="Topic Tag"
              value={input}
              onChange={onChange}
            ></input>
            <div className={styles.action_button}>
              <Button value="blacklist_tag_input" onClick={blacklistUser}>
                Blacklist
              </Button>
            </div>
          </div>
        )}
        {view == 3 && (
          <div className={styles.views}>
            <div className={styles.view_title}>
              <Button value={0} onClick={moveView}>
                <ArrowBackIcon />
              </Button>
              <h3>Ban User</h3>
            </div>

            <input
              id="ban_user_input"
              placeholder="User ID"
              value={input}
              onChange={onChange}
            ></input>
            <div className={styles.action_button}>
              <Button value="ban_user_input" onClick={banUser}>
                Ban
              </Button>
            </div>
          </div>
        )}
        {view == 4 && (
          <div className={styles.views}>
            <div className={styles.view_title}>
              <Button value={0} onClick={moveView}>
                <ArrowBackIcon />
              </Button>
              <h3>Clear Chatroom</h3>
            </div>

            <input
              id="clear_chatroom_input"
              placeholder="Chatroom tag"
              value={input}
              onChange={onChange}
            ></input>
            <div className={styles.action_button}>
              <Button value="clear_chatroom_input" onClick={clearChat}>
                Clear
              </Button>
            </div>
          </div>
        )}
        {view == 5 && (
          <div className={styles.views}>
            <div className={styles.view_title}>
              <Button value={0} onClick={moveView}>
                <ArrowBackIcon />
              </Button>{" "}
              <h3>Reported Users</h3>
              <div className="messages">
                <h3>{"type: " + type}</h3>
                <h3>{"Alias: " + alias}</h3>
                <h3>{"Message: " + message}</h3>
                <h3>{"-----------------"}</h3>
              </div>
              <Button value={6} onClick={clearReport}>
                <h3>Clear Report</h3>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    authSlice: state.authSlice,
    userSlice: state.userSlice,
    roomSlice: state.roomSlice,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: () => dispatch(logoutUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
