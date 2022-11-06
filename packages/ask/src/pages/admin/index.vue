<script setup>
import { useRouter } from 'vue-router';
import {ElMessageBox, ElMessage} from 'element-plus';
import {ref, onMounted} from 'vue';
import {surveyList, deleteSurvey} from '@/utils/request';
import {todoFunc, noop} from '@/utils/feature';
import Qrcode from '@/components/qrcode.vue'

const router = useRouter();

const tableData = ref([]);

const drawer = ref(false);

const multipleTableSelection = ref([]);

const userName = ref(localStorage.getItem('userName'));

onMounted(() => {
    initData();
});

const initData = () => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
        router.push({
            name: 'Login'
        })
    } else {
        surveyList({
            username: localStorage.getItem('userName')
        }).then(res => {
            tableData.value = res.data;
        })
    }
};

const handleDelete = (row, idx) => {
    ElMessageBox.confirm(
        `确认删除问卷${idx+1}-${row.title} ？`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        deleteSurvey({
            surveyId: row.id
        }).then(res => {
            if (res.data === 1) {
                ElMessage.success('删除成功');
                initData();
            }
        })
    }).catch(() => noop());
};

const handleCreate = () => {
    router.push({
        name: 'Creator'
    })
};

const handleModify = (row) => {
    sessionStorage.setItem('survey', JSON.stringify(row));
    router.push({
        name: 'Creator',
        query: {
            surveyId: row.id
        }
    })
};

const handleLogout = () => {
    localStorage.removeItem('userName');
    router.push({
        name: 'Login'
    })
}

// 生成投放链接
const handleUrl = () => {
    if (multipleTableSelection.value.length) {
        drawer.value = true;
    } else {
        ElMessage.error('请先选择要投放的问卷')
    }
};


</script>

<template>
    <div class="admin-wrapper">
        <div class="user-info">欢迎您 {{userName}} 
            <el-button type='primary' text='primary' @click="handleLogout">退出</el-button>
        </div>
        <div class="btns-wrapper">
            <el-button type="primary" @click="handleCreate">新建问卷</el-button>
            <el-button type="success" @click="handleUrl">生成投放链接</el-button>
        </div>
        <el-table
            :data="tableData"
            stripe
            border
            style="width: 100%; height: 80%;"
            @selection-change="val => multipleTableSelection = val"
        >
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" />
            <el-table-column prop="title" label="问卷名称" />
            <el-table-column prop="id" label="问卷id" width="80" />
            <el-table-column label="操作" width="300" >
                <template #default="scope">
                    <el-button type="primary" size="small" @click="handleModify(scope.row)">
                        编辑
                    </el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row, scope.$index)">
                        删除
                    </el-button>
                    <el-button type="success" size="small" @click="todoFunc">导出数据</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-drawer
        v-if="drawer"
        v-model="drawer"
        title="创建投放链接"
        direction="rtl"
    >
        <Qrcode
            :surveyList="multipleTableSelection"
        />
    </el-drawer>
</template>

<style scoped>
.admin-wrapper {
    width: 1200px;
    height: 100vh;
    position: relative;
}

.user-info {
    position: absolute;
    right: 0;
    top: 10px;
}

.btns-wrapper {
    height: 15%;
    box-sizing: border-box;
    padding-top: 5%;
}
</style>