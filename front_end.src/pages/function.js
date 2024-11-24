const URL = 'http://localhost:8081/Contacts';

// 添加联系人
export async function addContact(contact) {
    try {
        const response = await fetch('http://127.0.0.1:8081/Contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contact),
        });
        if (!response.ok) {
            throw new Error('网络错误');
        }
        if (!this.contactname || !this.contactphone) {
            console.error('姓名和电话是必填的');
            return;
        }
        const newContact = await response.json();
        console.log('添加联系人成功:', newContact);
        return newContact;
    } catch (error) {
        console.error('添加联系人失败:', error);
    }
}

// 获取所有联系人
export async function fetchAllContacts() {
    try {
        const response = await fetch(`${URL}/findAll`);
        if (!response.ok) {
            throw new Error('网络错误');
        }
        const contacts = await response.json();
        console.log('所有联系人:', contacts);
        return contacts;
    } catch (error) {
        console.error('获取联系人失败:', error);
    }
}

// // 根据 ID 获取联系人
// export async function getContactById(id) {
//     try {
//         const response = await fetch(`${URL}/${id}`);
//         if (!response.ok) {
//             throw new Error('联系人未找到');
//         }
//         const contact = await response.json();
//         console.log('获取联系人:', contact);
//         return contact;
//     } catch (error) {
//         console.error('获取联系人失败:', error);
//     }
// }

// // 更新联系人信息
// export async function updateContact(id, updatedContact) {
//     try {
//         const response = await fetch(`${URL}/${id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(updatedContact),
//         });
//         if (!response.ok) {
//             throw new Error('更新联系人失败');
//         }
//         const contact = await response.json();
//         console.log('更新后的联系人:', contact);
//         return contact;
//     } catch (error) {
//         console.error('更新联系人失败:', error);
//     }
// }

// 删除联系人
// export async function deleteContact(id) {
//     try {
//         const response = await fetch(`${URL}/${id}`, {
//             method: 'DELETE',
//         });
//         if (!response.ok) {
//             throw new Error('删除联系人失败');
//         }
//         console.log('联系人删除成功');
//     } catch (error) {
//         console.error('删除联系人失败:', error);
//     }
// }

