import * as React from 'react';
import { Box, CardMedia } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Person, MenuBook, CalendarViewWeek, ReportProblem, Article } from '@mui/icons-material';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import type { Navigation, Router } from '@toolpad/core/AppProvider';
import BookManage from '../BookManage';
import GenreManage from '../GenreManage';
import UserManage from '../UserManage';
import ReportManage from '../ReportManage';
import logo from "../../../assets/logo.png"
import AddGenre from '../GenreManage/AddGenre';
import PostManage from '../PostManage';
import AddBook from '../BookManage/AddBook';

const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: 'book',
        title: 'Books Manage',
        icon: <MenuBook />,
    },
    {
        segment: 'genre',
        title: 'Genre Manage',
        icon: <CalendarViewWeek />,
    },
    {
        segment: 'user',
        title: 'Users Manage',
        icon: <Person />,
    },
    {
        segment: 'post',
        title: 'Post Manage',
        icon: <Article />,
    },
    {
        segment: 'report',
        title: 'Report Manage',
        icon: <ReportProblem />,
    },

];

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function DemoPageContent({ pathname }: { pathname: string }) {

    return (
        <Box
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            {pathname === '/book' && (

                < BookManage />

            )}
            {pathname === '/genre' && (
                <>
                    <AddGenre />
                    <GenreManage />
                </>
            )}
            {pathname === '/user' && (
                <UserManage />
            )}
            {pathname === '/post' && (
                <PostManage />
            )}
            {pathname === '/report' && (
                <ReportManage />
            )}
        </Box>
    );
}


interface DemoProps {
    window?: () => Window;
}

export default function DashboardLayoutSideBar(props: DemoProps) {
    const { window } = props;
    const [pathname, setPathname] = React.useState('/book');

    const router = React.useMemo<Router>(() => {
        return {
            pathname,
            searchParams: new URLSearchParams(),
            navigate: (path) => setPathname(String(path)),
        };
    }, [pathname]);

    // console.log(pathname)

    const demoWindow = window !== undefined ? window() : undefined;

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
            window={demoWindow}
            branding={{
                logo: <CardMedia
                    component="img"
                    alt="Tag Image"
                    image={logo}
                    sx={{
                        // position: 'absolute',
                        // top: 0,
                        // left: 50,
                        width: 50, // Adjust the width of the tag image
                        height: 50, // Adjust the height of the tag image
                        objectFit: 'contain', // Ensure the tag image maintains its aspect ratio
                        zIndex: 99
                    }}
                />
                ,
                title: ""
            }}
        >
            <DashboardLayout
                slots={{ toolbarAccount: () => null, }}
            >
                <DemoPageContent pathname={pathname} />
            </DashboardLayout>
        </AppProvider>
    );
}
