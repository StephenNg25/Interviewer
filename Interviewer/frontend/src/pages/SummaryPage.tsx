import SummaryTable from '@/components/SummaryTable'

import { Card, CardTitle } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { generateSummary } from "@/services/cohereService";

const SummaryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { resumeFile, jobDescription, messages} = location.state || {};
    const [summary, setSummary] = useState("")
    useEffect(() => {
        const getSummary = async () => {
            console.log(messages)
            console.log(messages.reduce((res, message) => {return res += `${message['role'] == 'user' ? 'candidate:' : 'interviewer:'} ${message['content']} \n\n`}, ""))
            const response = await generateSummary(resumeFile, jobDescription, messages)
            setSummary(response)
            console.log(response)
        }
        getSummary()
    }, []); 
    return (
        <div className="min-h-screen h-screen bg-gradient-to-b from-white to-gray-50 p-4">
            <Card className="p-4 shadow-md rounded-xl bg-white h-full  flex flex-col">
                <div style = {{display : "flex", flexDirection : "column", alignItems : "center"}}>
                    <img style = {{width : "12%"}} src = "https://i.ibb.co/9kL3hCrQ/smartjimmy.png"></img>
                    <h3 className="text-lg font-semibold mb-4 sticky top-0 bg-white py-2">Jimmy's feedback</h3>
                </div>
                {summary ? 
                    <div>
                        Awaiting Jimmy's feedback...
                    </div> :
                    <div>
                        {summary}
                    </div>
                }
                <h3 style = {{textAlign : "center", fontSize : "20px"}}>TL;DR</h3>
                <SummaryTable summary = {["Good You talked clearly with confidence", "Bad You went on a tangent when discussing TypeScript", "Good You listed experiences relevant to the role"]}></SummaryTable>
                <Button variant = "outline-secondary" onClick = {() => {navigate("/")}}>Return to menu</Button>
            </Card>
        </div>
    )
}

export default SummaryPage