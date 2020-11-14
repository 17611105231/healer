<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/home-logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>

      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollaspe ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          :unique-opened="true"
          :collapse="isCollaspe"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="(item, index) in menuList"
            :index="item.id + ''"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[index]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subItem in item.children"
              :index="'/' + subItem.path"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menuList: [],
      iconObj: {
        0: 'el-icon-user-solid',
        1: 'el-icon-s-platform',
        2: 'el-icon-s-goods',
        3: 'el-icon-s-order',
        4: 'el-icon-s-data'
      },
      isCollaspe: false,
      //被激活的链接地址
      activePath: ''
    }
  },

  created() {
    //获取左侧菜单
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    getMenuList() {
      //获取所有菜单
      this.$http.get('menus').then(response => {
        const res = response.data
        if (res.meta.status !== 200) {
          this.$message({
            message: res.meta.msg,
            type: error
          })
        } else {
          this.menuList = res.data
          // console.log(this.menuList)
        }
      })
    },
    //点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollaspe = !this.isCollaspe
    },
    // 保存连接的激活状态
    saveNavState(activePath) {
      sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  div img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ddd;
  }
  > div {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 20px;
    span {
      margin-left: 15px;
    }
  }
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
</style>
