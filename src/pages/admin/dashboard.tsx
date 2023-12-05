import { Card, Col, Row, Statistic } from "antd";
import CountUp from 'react-countup';
import { callAnalyzeSkill, callAnalyzeLevel } from 'config/api';
import { useState } from 'react';
import { forEach } from "lodash";

const DashboardPage = () => {
    const [activeUsers, setActiveUsers] = useState<undefined | string>(undefined);

    const formatter = (value: number | string) => {
        return (
            <CountUp end={Number(value)} separator="," />
        );
    };
    const analyzeSkill = async () => {
        let res = await callAnalyzeSkill()
        let activeUsers
        if (res.data) {
            for (const [key, value] of Object.entries(res.data)) {
                if (key === "BACKEND") {
                    activeUsers = value
                }
            }
        }
        setActiveUsers(activeUsers);
    }
    return (
        <Row gutter={[20, 20]}>
            <Col span={24} md={8}>
                <Card title="Card title" bordered={false} >
                    <Statistic
                        title="Active Users"
                        value={activeUsers}
                        formatter={formatter}
                    />

                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card title="Card title" bordered={false} >
                    <Statistic
                        title="Active Users"
                        value={112893}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card title="Card title" bordered={false} >
                    <Statistic
                        title="Active Users"
                        value={112893}
                        formatter={formatter}
                    />
                </Card>
            </Col>

        </Row>
    )
}

export default DashboardPage;