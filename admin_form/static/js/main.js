document.addEventListener('DOMContentLoaded', () => {
    loadLoaiXeList(); // Tải danh sách khi mới vào
});

// --- TAB SWITCHING ---
function switchTab(tabName) {
    const tabLoaiXe = document.getElementById('tab-loaixe');
    const tabXe = document.getElementById('tab-xe');
    const sectionLoaiXe = document.getElementById('section-loaixe');
    const sectionXe = document.getElementById('section-xe');

    if (tabName === 'loaixe') {
        tabLoaiXe.className = "px-6 py-2 text-orange-500 border-b-2 border-orange-500 font-bold focus:outline-none transition-colors";
        tabXe.className = "px-6 py-2 text-gray-400 font-medium hover:text-gray-600 focus:outline-none transition-colors";
        sectionLoaiXe.classList.remove('hidden');
        sectionXe.classList.add('hidden');
    } else {
        tabXe.className = "px-6 py-2 text-orange-500 border-b-2 border-orange-500 font-bold focus:outline-none transition-colors";
        tabLoaiXe.className = "px-6 py-2 text-gray-400 font-medium hover:text-gray-600 focus:outline-none transition-colors";
        sectionXe.classList.remove('hidden');
        sectionLoaiXe.classList.add('hidden');
        
        // Khi chuyển sang tab Xe, reload lại dropdown loại xe để cập nhật mới nhất
        loadLoaiXeDropdown(); 
    }
}

// --- FORM HANDLING: LOẠI XE ---
const formLoaiXe = document.getElementById('formLoaiXe');
formLoaiXe.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = formLoaiXe.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Đang lưu...";
    btn.disabled = true;

    const formData = new FormData(formLoaiXe);
    const data = {
        MoTa: formData.get('MoTa'),
        GiaThue: parseInt(formData.get('GiaThue'))
    };

    try {
        const res = await fetch('/api/loaixe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert('Thêm Loại Xe thành công!');
            formLoaiXe.reset();
            loadLoaiXeList(); // Refresh list preview
        } else {
            const err = await res.json();
            alert('Lỗi: ' + err.error);
        }
    } catch (e) {
        alert('Lỗi kết nối: ' + e);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
});

// --- FORM HANDLING: XE ---
const formXe = document.getElementById('formXe');
formXe.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = formXe.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Đang lưu...";
    btn.disabled = true;

    const formData = new FormData(formXe);
    const data = {
        bienso: formData.get('bienso'),
        sodk: parseInt(formData.get('sodk')) || null,
        mauxe: formData.get('mauxe'),
        dungtich: parseInt(formData.get('dungtich')) || null,
        trangthai: formData.get('trangthai'),
        id_LoaiXe: parseInt(formData.get('id_LoaiXe'))
    };

    try {
        const res = await fetch('/api/xe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert('Thêm Xe thành công!');
            formXe.reset();
        } else {
            const err = await res.json();
            alert('Lỗi: ' + err.error);
        }
    } catch (e) {
        alert('Lỗi kết nối: ' + e);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
});

// --- DATA LOADING HELPERS ---
async function loadLoaiXeList() {
    const container = document.getElementById('listLoaiXe');
    container.innerHTML = '<p class="text-xs text-gray-500">Đang tải...</p>';
    try {
        const res = await fetch('/api/loaixe');
        const list = await res.json();
        container.innerHTML = '';
        if (list.length === 0) {
            container.innerHTML = '<p class="text-xs text-gray-400 italic">Chưa có loại xe nào.</p>';
            return;
        }
        list.forEach(item => {
            const div = document.createElement('div');
            div.className = "flex justify-between items-center bg-white p-2 rounded shadow-sm border border-gray-100";
            div.innerHTML = `
                <span class="text-sm font-semibold text-gray-700">${item.MoTa}</span>
                <span class="text-xs text-orange-500 font-bold">${item.GiaThue.toLocaleString()} VND</span>
            `;
            container.appendChild(div);
        });
    } catch (e) {
        container.innerHTML = '<p class="text-xs text-red-500">Lỗi tải danh sách.</p>';
    }
}

async function loadLoaiXeDropdown() {
    const select = document.getElementById('selectLoaiXe');
    // Giữ option đầu tiên
    select.innerHTML = '<option value="">-- Chọn Loại Xe --</option>';
    try {
        const res = await fetch('/api/loaixe');
        const list = await res.json();
        list.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id_LoaiXe;
            opt.innerText = `${item.MoTa} - ${item.GiaThue.toLocaleString()} VND`;
            select.appendChild(opt);
        });
    } catch (e) {
        console.error(e);
    }
}
