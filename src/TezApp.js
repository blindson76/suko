import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import DashboardIcon from '@material-ui/icons/Dashboard'
import { ExitToApp} from '@material-ui/icons/';
import { useRealmApp } from './RealmApp';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';

import Enstitu from './components/enstitu'
import AkademikPersonel from './components/akademikPersonel'
import Ogrenci from './components/ogrenci'
import TezOneri from './components/tezOneri'
import OnerilerDetay from './components/onerilerDetay'
import OgrenciPage from './components/ogrenciPage'
import AktifTezler from './components/aktifTezler'
import Istatistik from './components/istatistik'
const pages = {
  "IDARI" : [
    {
      title: "Enstitü/ADB/Bölüm",
      page:Enstitu,
      path:"/enstitu"
    },
    {
      title: "Personel",
      page:AkademikPersonel,
      path:"/personel"
    },
    {
      title: "Öğrenci",
      page:Ogrenci,
      path:"/ogrenci"
    },
    {
      title: "İstatistik",
      page:Istatistik,
      path:"/ogrenci"
    }
  ],
  
  "AKADEMIK" : [
    {
      title: "Tez Öneri",
      page: TezOneri,
      path:"/enstitu"
    },
    {
      title: "Öneri Geçmişi",
      page: OnerilerDetay,
      path:"/enstitu"
    },
    {
      title: "Aktif Danışmanlıklar",
      page: AktifTezler,
      path:"/enstitu"
    }
  ],
  "OGRENCI" : [
    {
      title: "Bilgilerim",
      page: OgrenciPage,
      path:"/enstitu"
    }
  ]
}
export default function () {
  const app = useRealmApp();
  const user = app.currentUser.customData;
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const { path, url } = useRouteMatch();
  const [currentPage, setCurrentPage] = useState(0);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const handleSignout = async  () => {
    await app.logOut()
  }
  const ActivePage = pages[user.type][currentPage].page;
  return (
    <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              Tez Takip Sistemi
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={handleSignout} >
              <ExitToApp />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText>{app.currentUser.customData.adi}</ListItemText>
            </ListItem>
          </List>
          <Divider />
          <List>{pages[user.type]?.map((page,index)=>(
            <ListItem button key={index} /*component={Link} to="/test"*/ onClick={()=>setCurrentPage(index)} >       
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText>{page.title}</ListItemText>
            </ListItem>
          ))}</List>
        </Drawer>
        <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={12}>
              <Paper >
                
                <ActivePage />
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));
