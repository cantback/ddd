<template>
    <!-- Add button and search bar -->
    <div id="container" class="center-justify">
        <div class="button-group">
            <el-button plain @click="dialogFormVisible = true" type="primary" class="add-contact-btn">Add contact</el-button>
            <el-button plain @click="exportToExcel" type="success" class="export-btn">Export Excel</el-button>
        </div>
        <div class="sea-container">
            <form action="">
                <input v-model="searchMsg" type="text" name="search" class="blue-input" @input="handleSearch(searchMsg)" autocomplete="off">
                <input type="submit" value="search" class="blue-button" autocomplete="off" @click.prevent="handleSearch(searchMsg),searchedTable()">
            </form>
            <ul v-if="searchMsg">
                <li v-for="item in filteredData" :key="item.id" @click="searchedTable(),searchMsg = ''">{{ item.contactName }}</li>
            </ul>
        </div>
    </div>
    <!-- 星标联系人表格 -->
    <div v-if="starredContacts.length > 0" class="table-section">
        <h3 class="table-title">
            <svg class="star-icon starred" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            星标联系人
        </h3>
        <el-table :data="starredContacts" style="width: 100vw; margin-bottom: 20px;">
            <el-table-column prop="name" label="Name" align="center" width="180" />
            <el-table-column prop="numbers" label="Phone Numbers" align="center">
                <template v-slot="scope">
                    <div class="numbers-list">
                        <div v-for="(number, index) in scope.row.numbers" :key="index" class="number-item">
                            {{ number }}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="email" label="Email" align="center"/>
            <el-table-column prop="address" label="Address" align="center"/>
            <el-table-column prop="media_account" label="Media Account" align="center"/>
            <el-table-column label="operation" align="center">
                <template v-slot="scope">
                    <button class="star-btn" @click="toggleStar(scope.row)">
                        <svg class="star-icon starred" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </button>
                    <el-button type="primary" @click="openEditForm(scope.row, getMainIndex(scope.row))">Edit</el-button>
                    <el-button type="warning" @click="deleteContact(scope.row.id)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- 普通联系人表格 -->
    <div class="table-section">
        <h3 class="table-title">
            <i class="contact-icon">👥</i>
            全部联系人
        </h3>
        <el-table :data="normalContacts" style="width: 100vw; height: 80vh;">
            <el-table-column prop="name" label="Name" align="center" width="180" />
            <el-table-column prop="numbers" label="Phone Numbers" align="center">
                <template v-slot="scope">
                    <div class="numbers-list">
                        <div v-for="(number, index) in scope.row.numbers" :key="index" class="number-item">
                            {{ number }}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="email" label="Email" align="center"/>
            <el-table-column prop="address" label="Address" align="center"/>
            <el-table-column prop="media_account" label="Media Account" align="center"/>
            <el-table-column label="operation" align="center">
                <template v-slot="scope">
                    <button class="star-btn" @click="toggleStar(scope.row)">
                        <svg class="star-icon" :class="{ starred: scope.row.target }" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </button>
                    <el-button type="primary" @click="openEditForm(scope.row, scope.$index)">Edit</el-button>
                    <el-button type="warning" @click="deleteContact(scope.row.id)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- 添加联系人对话框 -->
    <el-dialog v-model="dialogFormVisible" title="Add Contact" width="500">
        <el-form :model="form" :rules="rules" ref="formRef">
            <el-form-item label="contact name" :label-width="formLabelWidth" prop="name">
                <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item 
                v-for="(number, index) in form.numbers" 
                :key="index"
                :label="'phone number ' + (index + 1)"
                :label-width="formLabelWidth"
                :prop="'numbers.' + index"
                :rules="{ required: true, message: '电话号码不能为空', trigger: 'blur' }"
            >
                <div class="number-input-group">
                    <el-input v-model="form.numbers[index]" autocomplete="off" />
                    <el-button @click="removePhoneNumber(index)" v-if="index > 0" type="danger" circle>-</el-button>
                </div>
            </el-form-item>
            <el-button @click="addPhoneNumber" type="primary" plain>添加电话号码</el-button>
            <el-form-item label="email" :label-width="formLabelWidth" prop="email">
                <el-input v-model="form.email" autocomplete="off" />
            </el-form-item>
            <el-form-item label="address" :label-width="formLabelWidth" prop="address">
                <el-input v-model="form.address" autocomplete="off" />
            </el-form-item>
            <el-form-item label="media account" :label-width="formLabelWidth" prop="mediaAccount">
                <el-input v-model="form.mediaAccount" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false, resetForm()">Cancel</el-button>
                <el-button type="primary" @click="handAddContact()">Confirm</el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 编辑联系人对话框 -->
    <el-dialog v-model="dialogEditFormVisible" title="Edit Contact" width="500">
        <el-form :model="form1" :rules="rules" ref="formRef">
            <el-form-item label="contact name" :label-width="formLabelWidth" prop="name">
                <el-input v-model="form1.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="phone number" :label-width="formLabelWidth" prop="number">
                <el-input v-model="form1.number" autocomplete="off" />
            </el-form-item>
            <el-form-item label="email" :label-width="formLabelWidth" prop="email">
                <el-input v-model="form1.email" autocomplete="off" />
            </el-form-item>
            <el-form-item label="address" :label-width="formLabelWidth" prop="address">
                <el-input v-model="form1.address" autocomplete="off" />
            </el-form-item>
            <el-form-item label="media account" :label-width="formLabelWidth" prop="mediaAccount">
                <el-input v-model="form1.mediaAccount" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogEditFormVisible = false, resetForm1()">Cancel</el-button>
                <el-button type="primary" @click="handleEdit()">Confirm</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    // import {getData} from './connect.js'
// import {pageJump} from './pageJumps.js'
import { reactive, ref,computed,watchEffect} from 'vue'
import { onMounted } from 'vue'
// import {addContact,
//     fetchAllContacts} from './function.js'
import { inject } from 'vue';
const tableData = ref([]); //all form datas
const dialogFormVisible = ref(false) //whether add contact dialog is visible
const dialogEditFormVisible = ref(false) //whether edit contact dialog is visible
const allData = [];
var filteredData =ref([]);
        // get datas from api
        const url = 'http://127.0.0.1:8081/Contact'
          async function fetchHotSearch() {
            try {
                const response = await fetch(`${url}/findAll`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
                    }
                });
                const data = await response.json();
                if (data.data && Array.isArray(data.data)) {
                    // 确保每个联系人都有正确的数据结构
                    tableData.value = data.data.map(contact => ({
                        ...contact,
                        numbers: Array.isArray(contact.numbers) ? contact.numbers : [contact.numbers].filter(Boolean),
                        target: contact.target || false
                    }));
                    console.log(tableData.value);
                } else {
                    console.error('Expected an array, but got:', data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchHotSearch() //load data when page loaded
         //addContact
    async function addContact() {
        // 确保所有电话号码都不为空
        if (form.numbers.some(num => !num.trim())) {
            alert('电话号码不能为空');
            return;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
                },
                body: JSON.stringify({
                    name: form.name,
                    numbers: form.numbers,  // 发送号码数组
                    email: form.email,
                    address: form.address,
                    media_account: form.mediaAccount,  // 注意字段名匹配后端
                    target: false
                })
            });

            if (!response.ok) {
                throw new Error('添加联系人失败');
            }

            const newContact = await response.json();
            console.log('添加联系人成功:', newContact);
            
            // 更新表格数据
            tableData.value.push(newContact);

            // 重置表单
            resetForm();
            
            return newContact;
        } catch (error) {
            console.error('添加联人失败:', error);
            alert('添加联系人失败，请重试');
        }
    }
    const formRef = ref(null); //form reference
    const submitForm = () => {
        formRef.value.validate((valid) => {
            if (valid) {
            // submit data logic here
            console.log('提交成功', form);
            } else {
            console.log('验证失败');
            }
        });
        };
    function handAddContact() {
        formRef.value.validate(async (valid) => {
            if (valid) {
                dialogFormVisible.value = false;
                await addContact();
            } else {
                console.log('表单验证失败');
                return false;
            }
        });
    }
    
        // deleteContact
        async function deleteContact(id) {
        try {
            const response = await fetch(`${url}/${parseInt(id)}`, {
                method: 'DELETE',
                headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
                }
            });
            tableData.value = tableData.value.filter(item => item.id !== id);
            // this.tableData.splice(this.tableData.findIndex(item => item.id === id), 1);
            if (!response.ok) {
                throw new Error('删除联系人失败');
            }
            console.log('联��人删除成功');
        } catch (error) {
            console.error('删除联系人失败:', error);
        }
        }
    
   
    // updateContact 
    async function updateContact(id, updatedContact) {
        try {
            const response = await fetch(`${url}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
                },
                body: JSON.stringify({
                    name: updatedContact.name,
                    numbers: updatedContact.numbers,
                    email: updatedContact.email,
                    address: updatedContact.address,
                    media_account: updatedContact.mediaAccount,  // 注意字段名匹配后端
                    target: updatedContact.target
                })
            });

            if (!response.ok) {
                throw new Error('更新联系人失败');
            }

            const contact = await response.json();
            // 更新本地数据
            tableData.value[currentIndex.value] = contact;
            return contact;
        } catch (error) {
            console.error('更新联系人失败:', error);
            alert('更新联系人失败，请重试');
        }
    }
    const currentIndex = ref(null); // current index of the row being edited
    function openEditForm(row, index) {
        currentIndex.value = index;
        form1.name = row.name;
        form1.numbers = [...row.numbers];  // 复制数组
        form1.email = row.email;
        form1.address = row.address;
        form1.mediaAccount = row.media_account;  // 注意字段名匹配
        form1.target = row.target;
        dialogEditFormVisible.value = true;
    }
    // edit form
    function handleEdit() {
        if (!form1.name || !form1.numbers || !form1.email || !form1.address || !form1.mediaAccount) {
            return;
        }
        dialogEditFormVisible.value = false;
        // 更新联系人数据
        updateContact(tableData.value[currentIndex.value].id, {
            name: form1.name,
            numbers: form1.numbers,
            email: form1.email,
            address: form1.address,
            mediaAccount: form1.mediaAccount,
            target: form1.target
        });
        resetForm1();
    }
    function refresh() {
        location.reload()
    }
        
        
        const formLabelWidth = '140px'
        const form = reactive({
            name: '',
            numbers: [''],
            email: '',
            address: '',
            mediaAccount: '',
            target: false
        });
        const form1 = reactive({
            name: '',
            number: '',
            delivery: false,
            type: [],
            resource: '',
        })
        const rules = {
            name: [
                { required: true, message: '名称不能为空', trigger: 'blur' }
            ],
            'numbers.0': [  // 至少需要一个电话号码
                { required: true, message: '至少需要一个电话号码', trigger: 'blur' }
            ],
            email: [
                { required: true, message: '邮箱不能为空', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
            ],
            address: [
                { required: true, message: '地址不能为空', trigger: 'blur' }
            ],
            mediaAccount: [
                { required: true, message: '社交账号不能为空', trigger: 'blur' }
            ]
        };
        //search method
        var searchMsg = ref('');
        
        console.log(filteredData.value)
    
    function handleSearch(queryString) {
      filteredData.value = [];
        if(queryString === '') {
            return;
        }
      tableData.value.forEach(item => {
        if (item.contactName.indexOf(queryString) !== -1) {
            // if(queryString!== '') {
            this.filteredData.push(item);
            // }
          console.log(this.filteredData)
        }
      });
    }
    
    function searchedTable() {
        if(searchMsg.value === ''){
            location.reload()
            return;
        }
        tableData.value = filteredData.value;

    }
    // 计算星标联系人
    const starredContacts = computed(() => {
        return tableData.value.filter(contact => contact.target === true);
    });
    // 计算普通联系人（非星标）
    const normalContacts = computed(() => {
        return tableData.value.filter(contact => contact.target === false);
    });
    // 切换星标状态
    async function toggleStar(contact) {
        try {
            const response = await fetch(`${url}/${contact.id}/start`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
                }
            });
            
            if (!response.ok) {
                throw new Error('更新星标状态失败');
            }
            
            const updatedContact = await response.json();
            
            // 更新本地数据
            const index = tableData.value.findIndex(item => item.id === contact.id);
            if (index !== -1) {
                // 更新联系人数据，保持电话号码数组不变
                tableData.value[index] = {
                    ...updatedContact,
                    numbers: contact.numbers  // 保持原有的电话号码数组
                };
            }
            
            // 更新计算属性
            starredContacts.value = tableData.value.filter(contact => contact.target === true);
            normalContacts.value = tableData.value.filter(contact => contact.target === false);
            
        } catch (error) {
            console.error('更新星标状态失败:', error);
        }
    }
    // 重置表单
    function resetForm() {
        form.name = '';
        form.numbers = [''];  // 重置为只有一个空电话号码输入框
        form.email = '';
        form.address = '';
        form.mediaAccount = '';
        form.target = false;
        if (formRef.value) {
            formRef.value.clearValidate();
        }
    }
    function resetForm1() {
        form1.name = '';
        form1.number = '';
        form1.email = '';
        form1.address = '';
        form1.media_account = '';
        form1.target = false;
        formRef.value.clearValidate();
    }
    // 添加电话号码
    function addPhoneNumber() {
        form.numbers.push('');
    }
    // 移除电话号码
    function removePhoneNumber(index) {
        if (form.numbers.length > 1) {  // 保证至少有一个电话号码
            form.numbers.splice(index, 1);
        }
    }
    // 添加获取主表索引的方法
    function getMainIndex(contact) {
        return tableData.value.findIndex(item => item.id === contact.id);
    }
    // 添加导出Excel的方法
    async function exportToExcel() {
        try {
            const response = await fetch('http://localhost:8081/excel/export', {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.ms-excel',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': '*'
                }
            });
            
            if (!response.ok) {
                throw new Error('Export failed');
            }
            
            // 获取文件名
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = '联系人列表.xlsx';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = decodeURIComponent(filenameMatch[1]);
                }
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            // 清理
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
        } catch (error) {
            console.error('Export failed:', error);
            alert('导出失败，请重试');
        }
    }
</script>

<style>
    .export-btn {
    background: #4CAF50;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 10px;
    font-size: 14px;
    transition: background-color 0.3s;
}

.export-btn:hover {
    background: #45a049;
}

.export-btn:active {
    background: #3d8b40;
}

/* 如果按钮被禁用 */
.export-btn:disabled {
    background: #cccccc;
    cursor: not-allowed;
}
    ul{
        list-style: none;
        border: #317EF3;
        position: absolute;
        width: 350px;
        padding-left: 0;
        z-index: 10;
        padding-top: -10px;
    }
    li{
        text-align: left; 
        border: 1px rgb(194, 171, 168) solid;
    }
    .add-contact-btn {
        float: left;
        margin-left: 50px;
    }
.center-align {
    display: flex;
    align-items: center;
}
.center-justify {
    display: flex;
    justify-content: center;
}
.center-spacearound {
    display: flex;
    align-items: center;
    justify-content: space-around;
}
 
#container {
    width: 1280px;
    margin: 0 auto;
    display: flex; /* use flexbox */
    justify-content: space-between; 
    align-items: center; 
    box-sizing: border-box;
    padding-bottom: 15px;
    /*background-color: yellow;*/
}
 
/*search bar*/
.sea-container {
    width: 450px;
    height: 30px;
    margin: 0 auto;
    /* background-color: green; */
    /* border: 1px solid #317EF3; */
    padding-right: 400px;
}
.blue-input {
    float: left;
    width: 350px;
    height: 30px;
    box-sizing: border-box;
}
.blue-button {
    width: 100px;
    height: 30px;
    background-color: #317EF3;
    color: white;
    font-size: 15px;
    
}
 
/* search result */
ul#drop {
    list-style: none;
    margin: 0;
    padding: 0;
}
ul#drop li {
    margin: 0;
    padding: 10px;
}
 
ul li:hover {
    background-color: darkgrey;
	width:200px;
}
.star-btn {
    background: none;
    border: none;
    padding: 5px;
    cursor: pointer;
    margin-right: 10px;
    transition: transform 0.2s;  /* 添加过渡效果 */
}

.star-btn:hover {
    transform: scale(1.1);  /* 鼠标悬停时稍微放大 */
}

.star-icon {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: #999;
    stroke-width: 2;
    transition: all 0.3s;
}

.star-icon.starred {
    fill: #ffa940;
    stroke: #ffa940;
}

.star-btn:hover .star-icon {
    stroke: #ffa940;
}

/* 添加点击反馈效果 */
.star-btn:active {
    transform: scale(0.95);
}

.table-section {
    margin: 20px 0;
}

.table-title {
    font-size: 18px;
    color: #333;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 10px;
    border-left: 4px solid #317EF3;
}

.table-title .star-icon {
    width: 18px;
    height: 18px;
    margin-bottom: 2px;
}

.table-title .contact-icon {
    font-size: 20px;
    margin-bottom: 2px;
}

/* 确保星标图标在标题中的样式正确 */
.table-title .star-icon.starred {
    fill: #ffa940;
    stroke: #ffa940;
}

.number-input-group {
    display: flex;
    gap: 10px;
    align-items: center;
}

.el-form-item + .el-button {
    margin-left: 140px;  /* 与表单项标签宽度对齐 */
    margin-bottom: 20px;
}

.numbers-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 5px 0;
}

.number-item {
    padding: 2px 0;
    color: #333;
}

/* 调整表格行高以适应多个号码 */
.el-table__row {
    min-height: 60px;
}

/* 确保单元格内容垂直居中 */
.el-table .cell {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 添加按钮组样式 */
.button-group {
    display: flex;
    gap: 10px;
    margin-left: 50px;
}

/* 修改导出按钮样式以匹配现有设计 */
.export-btn {
    background-color: #67c23a !important;
    color: white !important;
    border: none !important;
}

.export-btn:hover {
    background-color: #85ce61 !important;
}

.export-btn:active {
    background-color: #529b2e !important;
}
</style>