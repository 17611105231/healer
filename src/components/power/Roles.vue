<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" size="default" @click="addRoles"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table border stripe :data="rolesList">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- {{ scope.row }} -->
            <el-row
              :class="{
                bdbottom: true,
                bdtop: i1 === 0,
                vcenter: true
              }"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  type="primary"
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="{ bdtop: i2 !== 0, vcenter: true }"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <!-- 角色操作列 -->
        <el-table-column label="角色操作" width="300px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoles(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRolesInfo(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="resetAddRolesForm"
    >
      <!-- 主体区域 -->
      <el-form
        :model="addRolesForm"
        :rules="addRolesRules"
        ref="addRolesForm"
        label-width="85px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRolesDialogVisible"
      width="50%"
      @close="resetEditRolesForm"
    >
      <!-- 主体区域 -->
      <el-form
        :model="editRolesForm"
        :rules="editRolesRules"
        ref="addRolesForm"
        label-width="85px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      //控制添加角色对话框的显示与隐藏属性
      addRolesDialogVisible: false,
      //添加角色对话框表单数据
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      //添加角色对话框表单数据验证规则
      addRolesRules: {
        roleName: [{ required: true, message: '请输入角色名称', tirgger: blur }]
      },
      //控制编辑角色对话框的显示与隐藏属性
      editRolesDialogVisible: false,
      //编辑角色对话框表单数据
      editRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      //编辑角色对话框表单数据验证规则
      editRolesRules: {
        roleName: [{ required: true, message: '请输入角色名称', tirgger: blur }]
      },
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //所有权限的数据
      rightsList: [],
      //树形控件的树形绑定控件
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //默认选中的节点id值数组
      defKeys: [],
      //当前即将分配权限的角色id
      roleId: ''
    }
  },
  created() {
    //获取角色列表数据
    this.getRolesList()
  },
  methods: {
    // 发送请求获取角色列表所有数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //   console.log(res)
      this.rolesList = res.data
      //   console.log(this.rolesList)
    },
    // 点击添加角色按钮添加角色
    addRoles() {
      this.addRolesDialogVisible = true
    },
    //重置添加角色表单
    resetAddRolesForm() {
      this.$refs.addRolesForm.resetFields()
    },
    //点击确定按钮提交表单信息完成添加角色
    addRolesConfirm() {
      //进行表单提交的预验证
      this.$refs.addRolesForm.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // console.log(res)
        this.addRolesDialogVisible = false
        //重新获取表单
        this.getRolesList()
      })
    },
    //点击编辑按钮通过id获取表单数据
    async editRoles(id) {
      //   console.log(id)
      this.editRolesDialogVisible = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.editRolesForm = res.data
    },
    //重置编辑角色表单
    resetEditRolesForm() {
      this.$refs.addRolesForm.resetFields()
    },
    //点击确定按钮提交表单信息完成编辑角色
    editRolesConfirm() {
      //进行表单预验证

      this.$refs.addRolesForm.validate(async valid => {
        if (!valid) return this.$message.error('编辑失败')
        const { data: res } = await this.$http.put(
          `roles/${this.editRolesForm.roleId}`,
          this.editRolesForm
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改成功')
        this.getRolesList()
        this.editRolesDialogVisible = false
      })
    },
    //删除角色信息
    async removeRolesInfo(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      //   console.log(confirmResult)
      if (confirmResult === 'cancel') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
    },
    //根据id删除对应的权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult === 'cancel') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      role.children = res.data
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      //获取所有权限的数据
      const { data: res } = await this.$http.get('/rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //把获取到的权限数据保存到data中
      this.rightsList = res.data

      //通过foreach获取所有三级权限，还可以通过递归的方法，递归在下面，暂时还不太懂
      //一级权限
      role.children.forEach(value1 => {
        //二级权限
        value1.children.forEach(value2 => {
          //三级权限
          value2.children.forEach(value3 => {
            this.defKeys.push(value3.id)
          })
        })
      })
      this.setRightDialogVisible = true

      //  递归获取三级节点的id
      // this.getLeafKeys(role, this.defKeys)
      // this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有的三级权限的id，并保存到defKeys数组中
    // getLeafKeys(node, arr) {
    //   //如果当前node节点不包含children属性时，则是三级节点
    //   if (!node.children) {
    //     return arr.push(node.id)
    //   }
    //   node.children.forEach(item => {
    //     this.getLeafKeys(item, arr)
    //   })
    // }

    // 关闭分配权限对话框时，清空节点前面的对勾
    setRightDialogClosed() {
      this.defKeys = []
    },
    //点击为角色分配权限
    async allotRights() {
      const keys = this.$refs.treeRef
        .getCheckedKeys()
        .concat(this.$refs.treeRef.getHalfCheckedKeys())
      // console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
