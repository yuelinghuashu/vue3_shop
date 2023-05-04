<template>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>

        <el-table :data="rolesList.data" stripe border style="width: 100%">

            <el-table-column type="expand">
                <template #default="props">

                </template>
            </el-table-column>

            <el-table-column type="index"></el-table-column>
            <el-table-column prop="roleName" label="角色名称" />
            <el-table-column prop="roleDesc" label="角色描述" />
            <el-table-column label="操作" width="350px">
                <template v-slot="scope">
                    <el-button @click="showEditDialog(scope.row.id)" size="default" type="primary">
                        <el-icon :size="15">
                            <Edit />
                        </el-icon>
                        编辑
                    </el-button>
                    <el-button @click="removeRole(scope.row.id)" size="default" type="danger">
                        <el-icon :size="15">
                            <DeleteFilled />
                        </el-icon>
                        删除
                    </el-button>
                    <el-button size="default" type="warning">
                        <el-icon :size="15">
                            <Setting />
                        </el-icon>
                        分配权限
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <el-dialog v-model="addDialogVisible" title="添加角色" width="50%">

        <el-form @close="addDialogClose" ref="addRuleFormRef" :model="addRuleForm" status-icon :rules="addRules"
            label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addRuleForm.roleName" type="text" autocomplete="off" />
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addRuleForm.roleDesc" type="text" autocomplete="off" />
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addResetForm(addRuleFormRef)">取消</el-button>
                <el-button type="primary" @click="addSubmitForm(addRuleFormRef)">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="editDialogVisible" title="编辑角色" width="50%">

        <el-form ref="editRuleFormRef" :model="editRuleForm.data" status-icon :rules="editRules" label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="editRuleForm.data.roleName" type="text" autocomplete="off" />
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="editRuleForm.data.roleDesc" type="text" autocomplete="off" />
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="editResetForm(editRuleFormRef)">取消</el-button>
                <el-button type="primary" @click="editSubmitForm(editRuleFormRef)">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">

import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ArrowRight, Edit, DeleteFilled, Setting } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'


// 角色数据列表
const rolesList = reactive({
    data: []
})
// 控制添加角色的对话框的开关
const addDialogVisible = ref(false)
const addRuleForm = reactive({
    roleName: '',
    roleDesc: ''
})
const addRules = reactive({
    roleName: [
        { required: true, message: '请输入你的角色名称', trigger: 'blur' },
        { min: 3, max: 10, message: '角色名称长度必须在5至10之间', trigger: 'blur' },
    ],
    roleDesc: [
        { required: true, message: '请输入你的角色描述', trigger: 'blur' },
        { min: 5, max: 30, message: '角色描述长度必须在5至30之间', trigger: 'blur' },
    ],
})
// 控制编辑用户的对话框的开关
const editDialogVisible = ref(false)
const editRuleForm = reactive({
    data: {}
})
const editRules = reactive({
    roleName: [
        { required: true, message: '请输入你的角色名称', trigger: 'blur' },
        { min: 3, max: 10, message: '角色名称长度必须在5至10之间', trigger: 'blur' },
    ],
    roleDesc: [
        { required: true, message: '请输入你的角色描述', trigger: 'blur' },
        { min: 5, max: 30, message: '角色描述长度必须在5至30之间', trigger: 'blur' },
    ],
})

onMounted(() => {
    getRolesList()
})

const currentInstance = getCurrentInstance()
const { $axios } = currentInstance.appContext.config.globalProperties

const addRuleFormRef = ref<FormInstance>('')
const editRuleFormRef = ref<FormInstance>('')

// 获取角色数据列表
async function getRolesList() {
    const { data: res } = await $axios.get('roles')
    rolesList.data = res.data
    console.log(rolesList.data)
}

// 关闭事件
function addDialogClose() {
    addRuleFormRef.value.resetFields()
}

// 取消事件
function addResetForm(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.resetFields()
    addDialogVisible.value = false
}

// 添加角色事件
function addSubmitForm(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            // console.log('submit!')
            const { data: res } = await $axios.post('roles', addRuleForm)
            console.log(res)
            addDialogVisible.value = false
            getRolesList()
        } else {
            console.log('error submit!')
            return false
        }
    })
}

// 显示编辑角色的对话框
async function showEditDialog(id) {
    const { data: res } = await $axios.get(`roles/${id}`)
    editRuleForm.data = res.data
    console.log(editRuleForm.data)
    editDialogVisible.value = true
}

function editResetForm(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.resetFields()
    editDialogVisible.value = false
}

function editSubmitForm(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            // console.log('submit!')
            const { data: res } = $axios.put(`roles/${editRuleForm.data.roleId}`, { roleName: editRuleForm.data.roleName, roleDesc: editRuleForm.data.roleDesc })
            editDialogVisible.value = false
            getRolesList()
        } else {
            console.log('error submit!')
            return false
        }
    })
}

// 删除角色事件
function removeRole(id) {
    ElMessageBox.confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
            confirmButtonText: '好的',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await $axios.delete(`roles/${id}`)
            getRolesList()
            ElMessage({
                type: 'success',
                message: '已删除角色',
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除角色',
            })
        })
}
</script>

<style scoped></style>