import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { database } from "../../firebase";
import { getDatabase, ref, child, get } from "firebase/database";

const LeaveRequest = () => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onChange"
    })

    const [leaveType, setleaveType] = useState()
    const [availLeaves, setAvailLeaves] = useState();
    const [requestedLeaves, setRequestedLeaves] = useState(0);
    const [totalLeaves, setTotalLeaves] = useState();
    const [customError, setCustomError] = useState();
    const selectedLeaveId = watch("selectedLeaveType");
    const startDate = watch("selectStartDate");
    const endDate = watch("selectEndDate");
    const todayDate = new Date().toISOString().split("T")[0];
    const [minDate, setMinData] = useState(todayDate);
    

    useEffect(() => {
        const getData = async () => {
            const response = await fetch('https://cinegallery-9501c-default-rtdb.firebaseio.com/leaves.json')
            const data = await response.json();
            setleaveType(data)
            setAvailLeaves(data[0].availableLeaves)
            let leaveCount = 0;
            data.forEach(leave => {
                leaveCount += leave.availableLeaves
            })
            setTotalLeaves(leaveCount);
        }
        getData();
    }, [])

    useEffect(() => {
        const selectedLeave = leaveType?.find((leave) => {
            return leave.id === selectedLeaveId
        })
        setAvailLeaves(selectedLeave?.availableLeaves)
    }, [selectedLeaveId])

    // useEffect(() => {
    //     if(endDate){
    //         const timeDifference = ( Date.parse(endDate) - Date.parse(startDate) ) / ( 1000*60*60*24 ) + 1;
    //         setRequestedLeaves(timeDifference);
    //     }      
    // }, [endDate])

    useEffect(() => {   
        setMinData(startDate);
    }), [startDate]
    
    const submitData = (data) => {  
        const selectedID = data
        data.requestingLeaves = requestedLeaves;
        console.log(data)
        // const leaveData = JSON.stringify(data)
        updateLeaveRequest(data);
        updateRemainingLeaves(data);
        // const selectedLeave = leaveType.find((leave) => {
        //     return leave.id === selectedID
        // })
        // setAvailLeaves(selectedLeave.availableLeaves)
    };

    // adding leave list
    const updateLeaveRequest = async(leaveData) => {
        const response = await fetch('https://cinegallery-9501c-default-rtdb.firebaseio.com/leaveRequest.json',
            {
                method: "POST",
                header: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(leaveData),
            }
        );
        const data = await response.json();
        if(response.ok){
            console.log("leaves updated successfully", data)
        }
        else{
            console.log("failed to update leaves")
        }
    }

    // update the remaining leaves
    const updateRemainingLeaves = (data) => {
        // const { availableLeaves } = leaveType;
        const updatedLeave = totalLeaves - data.requestingLeaves;
        console.log("remleav", updatedLeave);
        const updatedData = leaveType.map((leave) => {
            if(leave.id === data.selectedLeaveType){
                return {...leave, availableLeaves: updatedLeave };
            }
            return leave;
        })
        setUpdatedLeaveDetails(updatedData);
        console.log("newLeave", updatedData);
    }

    const setUpdatedLeaveDetails = async(updatedData) => {
        const response = await fetch('https://cinegallery-9501c-default-rtdb.firebaseio.com/leaves.json',{
            method: "PUT",
            header:{
                "content-Type" : "application/json", 
            },
            body: JSON.stringify(updatedData)
        })
        const data = await response.json();
        if(response.ok){
            console.log("new data updated successfully", data)
        }
        else{
            console.log("failed to update new data")
        }
    }

    const validate = (e) => {
        setCustomError(null);
        if(startDate){
            const timeDifference = ( Date.parse(e.target.value) - Date.parse(startDate) ) / ( 1000*60*60*24 ) + 1;
            if(timeDifference > totalLeaves){
                setCustomError("exceeding total leave days")
                setRequestedLeaves(0);
            }
            else{
                setRequestedLeaves(timeDifference);
            }
        }
        else{
            setCustomError("first select the start date")
            return;
        }
    }

    // const dbRef = ref(getDatabase());
    // get(child(dbRef, `LeaveType`)).then((leavetype) => {
    //     if (leavetype.exists()) {
    //         console.log(leavetype.val());
    //     } else {
    //         console.log("No data available");
    //     }
    // }).catch((error) => {
    //     console.error(error);
    // });

    // const getData = fetch('https://cinegallery-9501c-default-rtdb.firebaseio.com/LeaveType.json')
    // .then((response) => 
    //     response.json()
    // )
    // .then((data) => {
    //     console.log(data);
    // })

    return (
        <>
            {
                leaveType && (
                    <div>
                        <h2>Leave Request</h2>
                        <form onSubmit={handleSubmit(submitData)}>
                            <h4>Total leaves</h4>
                            <p>{totalLeaves}</p>
                            <label>Leave Type</label>
                            {
                                leaveType && (
                                    <>
                                        <select 
                                            {...register("selectedLeaveType")}
                                            >
                                            {
                                                leaveType.map((leave) => (
                                                    <option key={leave.id} value={leave.id}>{leave.name}</option>
                                                ))
                                            }
                                        </select>
                                    </>
                                )
                            }
                            <p>{availLeaves}</p>
                            <p>Start Date</p>
                            <input type="date" name="startdate"
                                min={todayDate}
                                {...register("selectStartDate")}
                            ></input>
                            <p>End Date</p>
                            <input type="date" name="enddate"
                                min={todayDate ? minDate : todayDate}
                                {...register("selectEndDate")}
                                onChange={(e) => validate(e)}
                                required
                            ></input>
                            {customError && <p style={{ color: "red" }}>{customError}</p>}
                            <h4>Requesting leaves</h4>
                            <p>{requestedLeaves}</p>
                            <input type="submit" />
                        </form>
                    </div>
                )
            }

        </>
    )
}

export default LeaveRequest