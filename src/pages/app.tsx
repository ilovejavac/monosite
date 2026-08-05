import {Layout, Menu} from 'antd';

const items: MenuItem[] = [
    {
        key: '',
        label: <Link replace to="">app</Link>,
        icon: <Icon icon='ic:baseline-ac-unit'/>
    },
    {
        key: 'scheduler',
        label: <Link replace to="scheduler">scheduler</Link>,
        icon: <Icon icon='ic:baseline-ac-unit'/>
    },
];

export default function AppPage() {
    return (
        <>
            <Layout style={{minHeight: '100vh'}}>
                <Layout.Sider theme="light">
                    <Menu theme="light" defaultSelectedKeys={['app']} mode="inline" items={items}/>
                </Layout.Sider>
                <Layout.Content className='px-4 py-2'>
                    <Outlet/>
                </Layout.Content>
            </Layout>
        </>
    )
}
