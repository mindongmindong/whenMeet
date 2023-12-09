import { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/HomeParticipateForm.css"

function HomeParticipateForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const handleName = (event) => {
    setName(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const checkParticipantExistence = async () => {
    try {
      const response = await axios.get(
        `/meetings/${id}/participants/?name=${name}`
      );
      return false;
    } catch (err) {
      return true;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name === "") {
      alert("이름을 입력하세요");
    } else {
      let checkParticipant = await checkParticipantExistence();
      console.log(checkParticipant);
      if (checkParticipant) {
        // DB에 해당 이름이 존재하지 않으면
        try {
          const response = await axios.post(`/meetings/${id}/participants`, {
            name: name,
            password: password,
            email: email,
          });
          try {
            const response = await axios.post(
              `/meetings/${id}/entry`,
              {
                name: name,
                password: password,
              },
              {
                withCredentials: true,
              }
            );

            try {
              const response = await axios.get(`/meetings/${id}/`);
              console.log(response);
              const startDate = response.data.startDate;
              const endDate = response.data.endDate;
              const startTime = response.data.availableVotingStartTime;
              const endTime = response.data.availableVotingEndTime;
              try {
                const response = await axios.get(
                  `/meetings/${id}/my/schedules`
                );
                // console.log(startDate, endDate);
                navigate("UserTimeInfo", {
                  state: {
                    id: id,
                    startTime: startTime,
                    endTime: endTime,
                    startDate: startDate,
                    endDate: endDate,
                    schedules: response.data.schedules,
                  },
                });
              } catch (e) {
                console.log(e);
              }
            } catch (e) {
              console.log(e);
            }
          } catch (error) {
            if (error.response) {
              if (error.response.status === 401) {
                alert("Password를 잘못 입력하였습니다");
              } else if (error.response.status === 404) {
                alert("해당하는 이름이 존재하지 않습니다");
              } else if (error.response.status === 400) {
                alert("비밀번호를 설정하셨습니다. 비밀번호를 입력해주세요");
              } else {
                alert(`Unexpected status code: ${error.response.status}`);
              }
            } else {
              console.error(error);
            }
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        // 이미 DB에 참여자가 존재하는 경우
        try {
          await axios.post(
            `/meetings/${id}/entry`,
            {
              name: name,
              password: password,
            },
            {
              withCredentials: true,
            }
          );
          const response = await axios.get(`/meetings/${id}/my/schedules`); //투표 여부 확인을 위해
          console.log(response);
          const schedules = response.data.schedules;
          if (schedules.length) {
            // 투표를 진행하였으면 결과 페이지로 이동
            navigate(`/result/${id}`);
          } else {
            // 투표를 안했으면 투표페이지로 이동
            try {
              // 쿠키 재생성
              try {
                const response = await axios.get(`/meetings/${id}/`);
                console.log(response);
                const startDate = response.data.startDate;
                const endDate = response.data.endDate;
                const startTime = response.data.availableVotingStartTime;
                const endTime = response.data.availableVotingEndTime;
                navigate("UserTimeInfo", {
                  state: {
                    id: id,
                    startTime: startTime,
                    endTime: endTime,
                    startDate: startDate,
                    endDate: endDate,
                    schedules: schedules,
                  },
                });
              } catch (e) {
                console.log(e);
              }
            } catch (error) {
              if (error.response) {
                if (error.response.status === 401) {
                  alert("Password를 잘못 입력하였습니다");
                } else if (error.response.status === 404) {
                  alert("해당하는 이름이 존재하지 않습니다");
                } else if (error.response.status === 400) {
                  alert("비밀번호를 설정하셨습니다. 비밀번호를 입력해주세요");
                } else {
                  alert(`Unexpected status code: ${error.response.status}`);
                }
              } else {
                console.error(error);
              }
            }
          }
        } catch (error) {
          if (error.response) {
            if (error.response.status === 401) {
              alert("Password를 잘못 입력하였습니다");
            } else if (error.response.status === 404) {
              alert("해당하는 이름이 존재하지 않습니다");
            } else if (error.response.status === 400) {
              alert("비밀번호를 설정하셨습니다. 비밀번호를 입력해주세요");
            } else {
              alert(`Unexpected status code: ${error.response.status}`);
            }
          } else {
            console.error(error);
          }
        }
      }
    }
  };

  return (
    <form>
      <div>
        <h1>투표에 참여하기</h1>
        <h2 className="h2"> 아이디가 없다면 아래 양식에 맞춰 작성 후 참여하기를 누르세요</h2>
        <Input
          type="text"
          value={name}
          onChange={handleName}
          placeholder="이름"
        />
        <Input
          type="password"
          value={password}
          onChange={handlePassword}
          placeholder="Password(선택)"
        />
        <Input
          type="text"
          value={email}
          onChange={handleEmail}
          placeholder="이메일(선택)"
        />
        <Button type="submit" text="참여하기" onClick={handleSubmit} />
      </div>
    </form>
  );
}

export default HomeParticipateForm;
