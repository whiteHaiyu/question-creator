<script setup>
import {ref} from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {todoFunc} from '@/utils/feature';
import {register, login} from '@/utils/request'

const router = useRouter();

const state = ref('login'); // login 登录 signin 注册

const loginForm = ref({});

const sigininForm = ref({});

const loginSuccess = () => {
    // 保存用户登录信息
    localStorage.setItem('userName', loginForm.value.username);
    router.push({
        name: 'Admin'
    })
}

// 登录操作
const handleLogin = () => {
    if (loginForm.value.username && loginForm.value.password) {
        login(loginForm.value).then(res => {
            if (res.data === 1) {
                loginSuccess();
            } else {
                ElMessage.warning('账户名密码错误');
            }
        }).catch(err => {
            ElMessage.error(err);
        })
    } else {
        loginSuccess();
        ElMessage.error('请输入账户名密码');
    }
}

// 注册操作
const handleSiginin = () => {
    if (sigininForm.value.username && sigininForm.value.password && sigininForm.value.repassword) {
        if (sigininForm.value.password !== sigininForm.value.repassword) {
            ElMessage.error('两次密码不一致');
        } else {
            register({
                username: sigininForm.value.username,
                password: sigininForm.value.password
            }).then(res => {
                if (res.data === '注册成功') {
                    loginForm.value = {
                        username: sigininForm.value.username,
                        password: sigininForm.value.password
                    }
                    handleLogin();
                } else if (res.data === '用户名不能重复') {
                    ElMessage.warning('当前用户名已注册');
                } else {
                    ElMessage.error(res.data);
                }
            })
        }
    } else {
        ElMessage.error('请输入账户名密码');
    }
}

const handleChange = (type) => {
    loginForm.value = {};
    sigininForm.value = {};
    state.value = type;
}

</script>

<template>
    <div class="login-container">
        <div class="title">欢迎使用问卷创建系统</div>
        <el-card class="box-card">
            <template #header>
            <div class="card-header">
                <span :class="state === 'login' ? 'active btn' : 'btn'" @click="handleChange('login')">登录</span>
                <span :class="state === 'signin' ? 'active btn' : 'btn'" @click="handleChange('signin')">注册</span>
            </div>
            </template>
            <div class="card" v-if="state === 'login'">
                <el-form :model="loginForm" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input
                            v-model="loginForm.username"
                            placeholder="请输入用户名"
                        />
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input 
                            v-model="loginForm.password"
                            type="password"
                            placeholder="请输入密码"
                            show-password
                        />
                    </el-form-item>
                    <div class="btns-container">
                        <el-button type="primary" @click="handleLogin">登录</el-button>
                        <el-button @click="() => {todoFunc()}" type="primary" text="primary">忘记密码</el-button>
                    </div>
                </el-form>
            </div>
            <div class="card" v-else>
                <el-form :model="sigininForm" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input
                            v-model="sigininForm.username"
                            placeholder="请输入用户名"
                        />
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input 
                            v-model="sigininForm.password"
                            type="password"
                            placeholder="请输入密码"
                            show-password
                        />
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input 
                            v-model="sigininForm.repassword"
                            type="password"
                            placeholder="请输入密码"
                            show-password
                        />
                    </el-form-item>
                </el-form>
                <div class="btns-container">
                    <el-button type="primary" @click="handleSiginin">注册</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.title {
    font-weight: bold;
    font-size: 48px;
    margin-bottom: 50px;
}
.box-card {
  width: 480px;
  height: 320px;
}
.card-header {
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.active {
    color: #409EFF;
}

.btn {
    cursor: pointer;
}

.btns-container {
    text-align: center;
}
</style>