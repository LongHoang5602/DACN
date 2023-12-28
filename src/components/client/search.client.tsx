import { Button, Col, Form, Row, Select } from 'antd';
import { EnvironmentOutlined, MonitorOutlined } from '@ant-design/icons';
import { LOCATION_LIST, SKILLS_LIST } from '@/config/utils';
import { ProForm } from '@ant-design/pro-components';
import { callFindJobBySkillAndLocation } from '@/config/api';
import { Link, useNavigate } from 'react-router-dom';

export let skills: string[]
export let locations: string[]

export function setSkills(newSkills: string[]): void {
    skills = newSkills;
}


export function setLocations(newLocation: string[]): void {
    locations = newLocation;
}
const SearchClient = () => {
    const optionsSkills = SKILLS_LIST;
    const optionsLocations = LOCATION_LIST;
    const [form] = Form.useForm();
    const nav = useNavigate()

    const onFinish = async (values: any) => {
        if (values.skills) {
            skills = values.skills
        }
        if (values.location) {
            locations = values.location
        }

        nav('job')
    }


    return (
        <ProForm
            form={form}
            onFinish={onFinish}
            submitter={
                {
                    render: () => <></>
                }
            }
        >
            <Row gutter={[20, 20]}>
                <Col span={24}><h2>Việc Làm IT Cho Developer "Chất"</h2></Col>
                <Col span={24} md={16}>
                    <ProForm.Item
                        name="skills"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            showArrow={false}
                            style={{ width: '100%' }}
                            placeholder={
                                <>
                                    <MonitorOutlined /> Tìm theo kỹ năng...
                                </>
                            }
                            optionLabelProp="label"
                            options={optionsSkills}
                        />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={4}>
                    <ProForm.Item name="location">
                        <Select
                            mode="multiple"
                            allowClear
                            showArrow={false}
                            style={{ width: '100%' }}
                            placeholder={
                                <>
                                    <EnvironmentOutlined /> Địa điểm...
                                </>
                            }
                            optionLabelProp="label"
                            options={optionsLocations}
                        />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={4}>
                    <Button type='primary' htmlType='submit' >Search</Button>
                </Col>
            </Row>
        </ProForm>
    )
}
export default SearchClient;