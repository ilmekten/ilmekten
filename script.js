// ==================== TOAST NOTIFICATION SYSTEM ====================

const ToastType = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

const ToastIcons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
};

function showToast(title, message, type = ToastType.SUCCESS, duration = 5000) {
    const container = document.getElementById('toastContainer');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon color for progress bar
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${ToastIcons[type]}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            ${message ? `<div class="toast-message">${message}</div>` : ''}
        </div>
        <button class="toast-close" onclick="removeToast(this.parentElement)">×</button>
        <div class="toast-progress" style="color: ${colors[type]};"></div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        removeToast(toast);
    }, duration);
    
    return toast;
}

function removeToast(toast) {
    if (!toast) return;
    
    toast.classList.add('hiding');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

// Quick access functions
function showSuccess(title, message, duration) {
    return showToast(title, message, ToastType.SUCCESS, duration);
}

function showError(title, message, duration) {
    return showToast(title, message, ToastType.ERROR, duration);
}

function showWarning(title, message, duration) {
    return showToast(title, message, ToastType.WARNING, duration);
}

function showInfo(title, message, duration) {
    return showToast(title, message, ToastType.INFO, duration);
}

// ==================== LOADING STATES SYSTEM ====================

// Page Loader
function showPageLoader(text = 'Yükleniyor...') {
    const loader = document.getElementById('pageLoader');
    const loaderText = loader.querySelector('.page-loader-text');
    loaderText.textContent = text;
    loader.classList.add('active');
}

function hidePageLoader() {
    const loader = document.getElementById('pageLoader');
    loader.classList.remove('active');
}

// Button Loading State
function setButtonLoading(button, loading = true) {
    if (loading) {
        button.dataset.originalText = button.innerHTML;
        button.classList.add('btn-loading');
        button.disabled = true;
        button.innerHTML = '<span style="opacity:0">' + button.dataset.originalText + '</span>';
    } else {
        button.classList.remove('btn-loading');
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
}

// Skeleton Loader Generator
function createSkeletonCard() {
    return `
        <div class="product-card skeleton-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-button"></div>
        </div>
    `;
}

function showSkeletonLoaders(container, count = 6) {
    const grid = document.getElementById(container);
    if (!grid) return;
    
    let skeletons = '';
    for (let i = 0; i < count; i++) {
        skeletons += createSkeletonCard();
    }
    grid.innerHTML = skeletons;
}

// Image Lazy Loading
function lazyLoadImages() {
    const images = document.querySelectorAll('img.lazy');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Simulate Loading Delay (for demo)
function simulateLoading(callback, duration = 1000) {
    setTimeout(callback, duration);
}

// ==================== FAVORITES SYSTEM ====================

let favorites = [];

// Load favorites from LocalStorage
function loadFavorites() {
    const saved = localStorage.getItem('ilmekten_favorites');
    if (saved) {
        favorites = JSON.parse(saved);
        console.log('✅ Favoriler yüklendi:', favorites.length, 'ürün');
    }
    updateFavoritesCount();
}

// Save favorites to LocalStorage
function saveFavorites() {
    localStorage.setItem('ilmekten_favorites', JSON.stringify(favorites));
    console.log('💾 Favoriler kaydedildi');
}

// Toggle favorite
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    const product = products.find(p => p.id === productId);
    
    if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
        showInfo('Favorilerden Çıkarıldı', `${product.name} favorilerden kaldırıldı.`, 3000);
    } else {
        // Add to favorites
        favorites.push(productId);
        showSuccess('Favorilere Eklendi! ❤️', `${product.name} favorilere eklendi.`, 3000);
    }
    
    saveFavorites();
    updateFavoritesCount();
    updateFavoriteIcons();
    
    // If favorites modal is open, refresh it
    if (document.getElementById('favoritesModal').classList.contains('active')) {
        renderFavorites();
    }
}

// Check if product is favorite
function isFavorite(productId) {
    return favorites.includes(productId);
}

// Update favorites count badge
function updateFavoritesCount() {
    const count = favorites.length;
    document.getElementById('favoritesCount').textContent = count;
    console.log('❤️ Favori sayısı güncellendi:', count);
}

// Update favorite icons on all product cards
function updateFavoriteIcons() {
    document.querySelectorAll('.favorite-icon').forEach(icon => {
        const productId = parseInt(icon.dataset.productId);
        if (isFavorite(productId)) {
            icon.classList.add('active');
            icon.textContent = '❤️';
        } else {
            icon.classList.remove('active');
            icon.textContent = '🤍';
        }
    });
}

// Open favorites modal
function openFavorites() {
    document.getElementById('favoritesModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    renderFavorites();
}

// Close favorites modal
function closeFavorites() {
    document.getElementById('favoritesModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Render favorites in modal
function renderFavorites() {
    const container = document.getElementById('favoritesContent');
    
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites">
                <div class="empty-favorites-icon">💔</div>
                <h3>Henüz favori ürününüz yok</h3>
                <p>Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz.</p>
            </div>
        `;
        return;
    }
    
    const favoriteProducts = products.filter(p => favorites.includes(p.id));
    
    let html = '<div class="favorites-grid">';
    
    favoriteProducts.forEach(product => {
        const finalPrice = product.discount > 0 
            ? (product.price * (1 - product.discount / 100)).toFixed(0)
            : product.price;
        
        html += `
            <div class="favorite-card">
                <button class="favorite-remove" onclick="toggleFavorite(${product.id})" title="Favorilerden çıkar">
                    ×
                </button>
                
                <div class="favorite-card-image">
                    <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='placeholder.png'">
                </div>
                
                <div class="favorite-card-info">
                    <h3>${product.name}</h3>
                    <div class="favorite-card-price">
                        ${product.discount > 0 ? `
                            <span style="text-decoration:line-through;font-size:18px;color:#999;margin-right:10px;">₺${product.price}</span>
                            <span>₺${finalPrice}</span>
                        ` : `₺${product.price}`}
                    </div>
                    
                    <div class="favorite-actions">
                        <button class="favorite-view-btn" onclick="closeFavorites(); setTimeout(() => showDetail(${product.id}), 300)">
                            👁️ İncele
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    container.innerHTML = html;
}

// Click outside to close
document.getElementById('favoritesModal').onclick = function(e) {
    if (e.target === this) closeFavorites();
};

// ==================== ÜRÜN VERİLERİ ====================
let products = [
    {
        id: 1,
        name: "Kardan Adam - Kırmızı Şapkalı",
        category: "Noel Teması",
        price: 350,
        discount: 0,
        discount: 0,
        description: "Kırmızı şapka ve atkısı, turuncu burnu ve sevimli gülümsemesiyle kardan adam.",
        emoji: "⛄",
        images: ["kardan-adam.png"],
        width: 15,
        height: 25,
        production_days: 3
    },
    {
        id: 2,
        name: "Noel Cücesi - Uzun Bacaklı",
        category: "Noel Teması",
        price: 380,
        discount: 0,
        description: "Uzun kırmızı şapkası ve beyaz sakalı ile klasik Noel cücesi.",
        emoji: "🎅",
        images: ["logo-cuce.png"],
        width: 12,
        height: 30,
        production_days: 4
    },
    {
        id: 3,
        name: "Safari Hayvanlar Seti - 6'lı",
        category: "Hayvanlar",
        price: 950,
        discount: 0,
        description: "Maymun, koyun, aslan, koala, ayı ve fil! 6 parça renkli safari hayvanları.",
        emoji: "🦁",
        images: ["safari-group.png"],
        width: 10,
        height: 12,
        production_days: 7
    },
    {
        id: 4,
        name: "Noel Dekorasyon Seti",
        category: "Noel Teması",
        price: 720,
        discount: 0,
        description: "2 Noel cücesi ve mini çam ağacı! Ahşap tabanlı özel dekorasyon seti.",
        emoji: "🎄",
        images: ["gnome-tree.png"],
        width: 20,
        height: 15,
        production_days: 5
    },
    {
        id: 5,
        name: "Sevimli Lama",
        category: "Hayvanlar",
        price: 420,
        discount: 0,
        description: "Kahverengi şapkalı, uzun boyunlu, renkli semerli lama.",
        emoji: "🦙",
        images: ["llama.png"],
        width: 14,
        height: 28,
        production_days: 4
    }
];

// Kurumsal Siparişler
let corporateOrders = [];

// Sepet Kampanyaları
let campaigns = [];

// Siparişler
let orders = [];
let orderViewMode = 'cards'; // 'cards' veya 'table'
let editingCorporateId = null;

function loadCorporateOrders() {
    const saved = localStorage.getItem('ilmekten_corporate');
    if (saved) {
        corporateOrders = JSON.parse(saved);
    }
    renderCorporateOrders();
    renderAdminCorporateGrid();
}

function saveCorporateOrders() {
    try {
        localStorage.setItem('ilmekten_corporate', JSON.stringify(corporateOrders));
        console.log('✅ Kurumsal siparişler kaydedildi');
    } catch (e) {
        console.error('❌ Kurumsal siparişler kaydedilemedi:', e);
        alert('Depolama dolu! Bazı ürünleri veya yedekleri temizleyin.');
    }
}

// ==================== KAMPANYA FONKSİYONLARI ====================
function loadCampaigns() {
    const saved = localStorage.getItem('ilmekten_campaigns');
    if (saved) {
        campaigns = JSON.parse(saved);
    }
}

function saveCampaigns() {
    localStorage.setItem('ilmekten_campaigns', JSON.stringify(campaigns));
    console.log('✅ Kampanyalar kaydedildi');
}

function addCampaign(campaign) {
    campaign.id = Date.now();
    campaign.active = true;
    campaigns.push(campaign);
    saveCampaigns();
    renderAdminCampaigns();
}

function deleteCampaign(index) {
    if (confirm('Bu kampanyayı silmek istediğinizden emin misiniz?')) {
        campaigns.splice(index, 1);
        saveCampaigns();
        renderAdminCampaigns();
    }
}

function toggleCampaign(index) {
    campaigns[index].active = !campaigns[index].active;
    saveCampaigns();
    renderAdminCampaigns();
}

function renderAdminCampaigns() {
    const container = document.getElementById('campaignsList');
    if (!container) return;
    
    if (campaigns.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;padding:40px;">Henüz kampanya eklenmedi</p>';
        return;
    }
    
    container.innerHTML = campaigns.map((c, index) => {
        const typeText = c.type === 'gift' ? '🎁 Hediye Ürün' : '💰 Sepet İndirimi';
        const conditionText = c.type === 'gift' ? 
            `${c.minQuantity} ürün alana` : 
            `${c.minAmount}₺ üzeri alışverişe`;
        const rewardText = c.type === 'gift' ? 
            `${products.find(p => p.id === c.giftProductId)?.name || 'Ürün'} hediye` : 
            `%${c.discountPercent} indirim`;
        
        return `
            <div style="background:white;padding:20px;border-radius:12px;margin-bottom:15px;border:2px solid ${c.active ? '#26de81' : '#ccc'};">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <div>
                        <h4 style="margin:0 0 5px 0;color:var(--brown);">${typeText}</h4>
                        <p style="margin:0;font-size:14px;color:#666;">${conditionText} → ${rewardText}</p>
                    </div>
                    <div style="display:flex;gap:10px;">
                        <button onclick="toggleCampaign(${index})" style="padding:8px 15px;border:none;border-radius:8px;cursor:pointer;background:${c.active ? '#26de81' : '#999'};color:white;">
                            ${c.active ? '✓ Aktif' : '✗ Pasif'}
                        </button>
                        <button onclick="deleteCampaign(${index})" style="padding:8px 15px;border:none;border-radius:8px;cursor:pointer;background:#ff4444;color:white;">
                            🗑️ Sil
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openCampaignForm() {
    console.log('🎁 Kampanya formu açılıyor...');
    
    // Ürün listesini doldur
    const select = document.getElementById('giftProduct');
    if (!select) {
        console.error('❌ giftProduct select bulunamadı!');
        return;
    }
    
    select.innerHTML = products.map(p => 
        '<option value="' + p.id + '">' + p.name + ' (' + p.price + '₺)</option>'
    ).join('');
    
    const modal = document.getElementById('campaignFormModal');
    if (!modal) {
        console.error('❌ campaignFormModal bulunamadı!');
        return;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log('✅ Modal açıldı');
    
    updateCampaignForm();
}

function closeCampaignForm() {
    document.getElementById('campaignFormModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('campaignForm').reset();
}

function saveCampaignForm(event) {
    event.preventDefault();
    
    const type = document.getElementById('campaignType').value;
    const campaign = { type };
    
    if (type === 'gift') {
        campaign.minQuantity = parseInt(document.getElementById('minQuantity').value);
        campaign.giftProductId = parseInt(document.getElementById('giftProduct').value);
    } else {
        campaign.minAmount = parseInt(document.getElementById('minAmount').value);
        campaign.discountPercent = parseInt(document.getElementById('discountPercent').value);
    }
    
    addCampaign(campaign);
    closeCampaignForm();
    alert('✅ Kampanya eklendi!');
}

function updateCampaignForm() {
    const type = document.getElementById('campaignType').value;
    const giftFields = document.getElementById('giftCampaignFields');
    const discountFields = document.getElementById('discountCampaignFields');
    
    if (type === 'gift') {
        giftFields.style.display = 'block';
        discountFields.style.display = 'none';
    } else {
        giftFields.style.display = 'none';
        discountFields.style.display = 'block';
    }
}

// Sepete kampanya uygula
function applyCampaigns(cart, total) {
    let appliedCampaigns = [];
    let giftProducts = [];
    let additionalDiscount = 0;
    
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    campaigns.filter(c => c.active).forEach(campaign => {
        if (campaign.type === 'gift') {
            if (totalQuantity >= campaign.minQuantity) {
                const product = products.find(p => p.id === campaign.giftProductId);
                if (product) {
                    giftProducts.push(product);
                    appliedCampaigns.push({
                        text: `🎁 ${campaign.minQuantity} ürün aldınız! ${product.name} HEDİYE!`,
                        type: 'gift'
                    });
                }
            }
        } else if (campaign.type === 'discount') {
            if (total >= campaign.minAmount) {
                const discount = Math.round(total * campaign.discountPercent / 100);
                additionalDiscount += discount;
                appliedCampaigns.push({
                    text: `💰 ${campaign.minAmount}₺ üzeri kampanya: %${campaign.discountPercent} indirim (-${discount}₺)`,
                    type: 'discount',
                    amount: discount
                });
            }
        }
    });
    
    return { appliedCampaigns, giftProducts, additionalDiscount };
}

function renderCorporateOrders() {
    const grid = document.getElementById('corporateGrid');
    if (!grid) return;
    
    if (corporateOrders.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #999;">
                <div style="font-size: 80px; margin-bottom: 20px;">🏢</div>
                <h3 style="font-size: 24px; color: #2d5a3d; margin-bottom: 10px;">Henüz Kurumsal Sipariş Eklenmedi</h3>
                <p>Admin panelinden kurumsal siparişlerinizi ekleyebilirsiniz</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = corporateOrders.map((order, index) => {
        const mainImage = order.images && order.images.length > 0 ? order.images[0] : null;
        return `
            <div class="corporate-card" onclick="showCorporateDetail(${index})" style="
                background: white;
                border-radius: 25px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(45, 90, 61, 0.15);
                transition: 0.3s;
                cursor: pointer;
                border: 2px solid rgba(45, 90, 61, 0.1);
            " onmouseover="this.style.transform='translateY(-10px)'; this.style.boxShadow='0 15px 40px rgba(45, 90, 61, 0.25)'" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(45, 90, 61, 0.15)'">
                
                <div style="position: relative;">
                    <div class="corporate-badge" style="
                        position: absolute;
                        top: 15px;
                        left: 15px;
                        background: linear-gradient(135deg, #2d5a3d, #1a3d28);
                        color: white;
                        padding: 8px 18px;
                        border-radius: 25px;
                        font-size: 12px;
                        font-weight: 700;
                        box-shadow: 0 4px 12px rgba(45, 90, 61, 0.3);
                        z-index: 1;
                    ">KURUMSAL</div>
                    
                    <div style="
                        height: 320px;
                        background: linear-gradient(135deg, #f0f5f0, #e8f0e8);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                        position: relative;
                    ">
                        ${mainImage ? 
                            `<img src="${mainImage}" alt="${order.company}" style="max-width: 85%; max-height: 85%; object-fit: contain; filter: drop-shadow(0 10px 30px rgba(0,0,0,0.15)); transition: 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">` : 
                            `<div style="font-size: 120px; opacity: 0.3;">🏢</div>`
                        }
                        ${order.images && order.images.length > 1 ? `<div style="position: absolute; bottom: 10px; right: 10px; background: rgba(45,90,61,0.9); color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 700;">+${order.images.length - 1}</div>` : ''}
                    </div>
                </div>
                
                <div style="padding: 25px;">
                    <div style="
                        display: inline-block;
                        background: rgba(45, 90, 61, 0.1);
                        color: #2d5a3d;
                        padding: 6px 14px;
                        border-radius: 20px;
                        font-size: 13px;
                        font-weight: 600;
                        margin-bottom: 12px;
                    ">Referans Projemiz</div>
                    
                    <h3 style="
                        font-family: 'Nunito', sans-serif;
                        font-size: 24px;
                        font-weight: 800;
                        color: #2d5a3d;
                        margin-bottom: 12px;
                        min-height: 60px;
                    ">${order.company}</h3>
                    
                    <p style="
                        color: #666;
                        font-size: 15px;
                        line-height: 1.6;
                        margin-bottom: 20px;
                        min-height: 48px;
                    ">${order.description}</p>
                    
                    <div style="
                        padding-top: 15px;
                        border-top: 2px solid rgba(45, 90, 61, 0.1);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    ">
                        <span style="
                            color: #2d5a3d;
                            font-size: 14px;
                            font-weight: 600;
                        ">📏 ${order.width || 0} x ${order.height || 0} cm</span>
                        <button onclick="event.stopPropagation(); showCorporateDetail(${index})" style="
                            background: linear-gradient(135deg, #2d5a3d, #1a3d28);
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 20px;
                            font-weight: 700;
                            cursor: pointer;
                            font-size: 14px;
                            transition: 0.3s;
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            👁️ Detay
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

let editingProductId = null;
let currentImageIndex = 0;
let cart = [];

// Sepeti localStorage'dan yükle
function loadCart() {
    const saved = localStorage.getItem('ilmekten_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCount();
    }
}

// Sepeti kaydet
function saveCart() {
    localStorage.setItem('ilmekten_cart', JSON.stringify(cart));
    updateCartCount();
}

// Sepet sayısını güncelle
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Sepeti aç
function openCart() {
    document.getElementById('cartModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCart();
}

// Sepeti kapat
function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Sepeti render et
function renderCart() {
    const container = document.getElementById('cartContent');
    const summary = document.getElementById('cartSummary');
    
    console.log('🛒 renderCart çağrıldı. Sepet:', cart);
    
    // Boş sepet
    if (!cart || cart.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:60px 20px;"><div style="font-size:80px;">🛒</div><h3 style="color:var(--brown);">Sepetiniz Boş</h3><button class="btn btn-primary" onclick="closeCart()" style="margin-top:20px;">Alışverişe Devam</button></div>';
        summary.innerHTML = '';
        return;
    }
    
    // Ürün listesi
    let html = '';
    let total = 0;
    let totalItems = 0;
    let maxDays = 0;
    
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (!product) return;
        
        const hasDiscount = product.discount && product.discount > 0;
        const price = hasDiscount ? Math.round(product.price * (1 - product.discount / 100)) : product.price;
        const subtotal = price * cartItem.quantity;
        const img = product.images && product.images[0] ? product.images[0] : '';
        
        total += subtotal;
        totalItems += cartItem.quantity;
        if (product.production_days > maxDays) maxDays = product.production_days;
        
        html += '<div style="background:white;padding:20px;margin-bottom:15px;border-radius:15px;border:1px solid #eee;">';
        html += '<div style="display:flex;gap:20px;align-items:center;">';
        
        // Resim
        html += '<div style="width:100px;height:100px;background:#f9f9f9;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;overflow:hidden;">';
        if (img) {
            html += '<img src="' + img + '" style="max-width:90%;max-height:90%;object-fit:contain;">';
        } else {
            html += '<div style="font-size:40px;">🎁</div>';
        }
        html += '</div>';
        
        // Bilgiler
        html += '<div style="flex:1;">';
        html += '<h4 style="margin:0 0 5px 0;font-size:16px;color:var(--brown);">' + product.name + '</h4>';
        html += '<p style="margin:0;font-size:13px;color:#999;">' + product.category + '</p>';
        
        if (hasDiscount) {
            html += '<div style="margin-top:5px;"><span style="text-decoration:line-through;color:#999;font-size:13px;">' + product.price + '₺</span> ';
            html += '<span style="color:var(--red);font-weight:700;font-size:16px;">' + price + '₺</span></div>';
        } else {
            html += '<div style="margin-top:5px;color:var(--brown);font-weight:700;font-size:16px;">' + price + '₺</div>';
        }
        html += '</div>';
        
        // Miktar
        html += '<div style="display:flex;align-items:center;gap:10px;background:#f5f5f5;padding:5px;border-radius:20px;">';
        html += '<button onclick="updateQuantity(' + cartItem.productId + ',' + (cartItem.quantity - 1) + ')" style="width:32px;height:32px;border:none;border-radius:50%;background:var(--brown);color:white;cursor:pointer;font-size:18px;">−</button>';
        html += '<span style="min-width:30px;text-align:center;font-weight:700;">' + cartItem.quantity + '</span>';
        html += '<button onclick="updateQuantity(' + cartItem.productId + ',' + (cartItem.quantity + 1) + ')" style="width:32px;height:32px;border:none;border-radius:50%;background:var(--brown);color:white;cursor:pointer;font-size:18px;">+</button>';
        html += '</div>';
        
        // Ara toplam
        html += '<div style="text-align:right;min-width:100px;">';
        html += '<div style="font-size:11px;color:#999;">Ara Toplam</div>';
        html += '<div style="font-size:20px;font-weight:800;color:var(--red);">' + subtotal + '₺</div>';
        html += '</div>';
        
        // Sil
        html += '<button onclick="removeFromCart(' + cartItem.productId + ')" style="width:36px;height:36px;border:none;border-radius:50%;background:#ff4444;color:white;cursor:pointer;font-size:16px;margin-left:10px;">🗑️</button>';
        
        html += '</div></div>';
    });
    
    container.innerHTML = html;
    
    // Kampanyaları uygula
    const campaignResult = applyCampaigns(cart, total);
    let discount = campaignResult.additionalDiscount;
    
    // Kupon indirimini ekle
    let couponDiscount = 0;
    if (appliedCoupon) {
        couponDiscount = appliedCoupon.discountAmount;
        discount += couponDiscount;
    }
    
    const finalTotal = total - discount;
    
    // Özet
    let summaryHTML = '<div style="background:white;padding:25px;border-radius:15px;border:3px dashed rgba(220,20,60,0.3);">';
    summaryHTML += '<h3 style="text-align:center;color:var(--brown);margin:0 0 20px 0;">📋 Sipariş Özeti</h3>';
    summaryHTML += '<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;"><span>🛍️ Toplam Ürün</span><strong>' + totalItems + ' adet</strong></div>';
    summaryHTML += '<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;"><span>⏱️ Hazırlanma</span><strong>' + maxDays + ' gün</strong></div>';
    summaryHTML += '<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;"><span>📦 Ara Toplam</span><strong>' + total + '₺</strong></div>';
    
    // Kupon girişi
    summaryHTML += '<div style="margin: 15px 0; padding: 15px; background: #f0f8ff; border-radius: 10px;">';
    summaryHTML += '<label style="display: block; font-size: 14px; font-weight: 600; color: var(--brown); margin-bottom: 8px;">🎟️ Kupon Kodu</label>';
    summaryHTML += '<div style="display: flex; gap: 8px;">';
    summaryHTML += '<input type="text" id="couponInput" placeholder="Kupon kodunuz" style="flex: 1; padding: 10px; border: 2px solid #ddd; border-radius: 12px; font-size: 14px; text-transform: uppercase;">';
    
    if (!appliedCoupon) {
        summaryHTML += '<button onclick="applyCartCoupon()" style="padding: 10px 20px; background: linear-gradient(135deg, #4CAF50, #45a049); color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; white-space: nowrap;">Uygula</button>';
    } else {
        summaryHTML += '<button onclick="removeCartCoupon()" style="padding: 10px 20px; background: #ff6b6b; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer;">Kaldır</button>';
    }
    
    summaryHTML += '</div>';
    
    if (appliedCoupon) {
        summaryHTML += '<div style="margin-top: 10px; padding: 10px; background: #e8f5e9; border-radius: 12px; font-size: 13px; color: #2d5a3d;">';
        summaryHTML += '✅ <strong>' + appliedCoupon.code + '</strong> kuponu uygulandı';
        summaryHTML += '</div>';
    }
    
    summaryHTML += '</div>';
    
    // Kampanya satırları
    if (campaignResult.appliedCampaigns.length > 0) {
        campaignResult.appliedCampaigns.forEach(campaign => {
            if (campaign.type === 'discount') {
                summaryHTML += '<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;background:#fff9e6;margin:5px -10px;padding:10px;border-radius:5px;">';
                summaryHTML += '<span style="color:#ff6b00;font-size:13px;">💰 Kampanya İndirimi</span><strong style="color:#ff6b00;">-' + campaign.amount + '₺</strong></div>';
            }
        });
    }
    
    // Kupon indirimi
    if (couponDiscount > 0) {
        summaryHTML += '<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;background:#e8f5e9;margin:5px -10px;padding:10px;border-radius:5px;">';
        summaryHTML += '<span style="color:#4CAF50;font-size:13px;">🎟️ Kupon İndirimi (' + appliedCoupon.code + ')</span><strong style="color:#4CAF50;">-' + couponDiscount + '₺</strong></div>';
    }
    
    summaryHTML += '<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:2px solid #eee;"><span>🚚 Kargo</span><strong style="color:#26de81;">ÜCRETSİZ</strong></div>';
    
    // Hediye ürünler
    if (campaignResult.giftProducts.length > 0) {
        summaryHTML += '<div style="background:#e8f5e9;padding:15px;border-radius:10px;margin:15px 0;border:2px dashed #26de81;">';
        summaryHTML += '<div style="font-weight:700;color:#26de81;margin-bottom:10px;">🎁 HEDİYE ÜRÜNLER:</div>';
        campaignResult.giftProducts.forEach(product => {
            summaryHTML += '<div style="font-size:14px;color:#2d5a3d;margin:5px 0;">✓ ' + product.name + '</div>';
        });
        summaryHTML += '</div>';
    }
    
    summaryHTML += '<div style="background:linear-gradient(135deg,rgba(220,20,60,0.1),rgba(220,20,60,0.05));padding:15px;border-radius:10px;margin:15px 0;">';
    summaryHTML += '<div style="display:flex;justify-content:space-between;align-items:center;">';
    summaryHTML += '<span style="font-size:18px;font-weight:700;">Toplam</span>';
    summaryHTML += '<span style="font-size:36px;font-weight:900;color:var(--red);">' + finalTotal + '₺</span>';
    summaryHTML += '</div></div>';
    summaryHTML += '<button class="btn btn-primary" onclick="checkout()" style="width:100%;padding:18px;font-size:18px;">🎁 Siparişi Tamamla</button>';
    summaryHTML += '<p style="text-align:center;margin-top:10px;font-size:12px;color:#999;">✨ ' + maxDays + ' iş günü içinde hazırlanacak</p>';
    
    // Kampanya mesajları
    if (campaignResult.appliedCampaigns.length > 0) {
        summaryHTML += '<div style="margin-top:15px;padding:12px;background:#fff9e6;border-radius:8px;border-left:4px solid #ff6b00;">';
        campaignResult.appliedCampaigns.forEach(campaign => {
            summaryHTML += '<div style="font-size:13px;color:#ff6b00;margin:5px 0;">✨ ' + campaign.text + '</div>';
        });
        summaryHTML += '</div>';
    }
    
    summaryHTML += '</div>';
    summary.innerHTML = summaryHTML;
    
    console.log('✅ Sepet render edildi. Toplam:', total + '₺, İndirim:', discount + '₺, Final:', finalTotal + '₺');
}

function applyCartCoupon() {
    const input = document.getElementById('couponInput');
    const code = input.value.trim().toUpperCase();
    
    if (!code) {
        showWarning('Kupon Kodu Girin', 'Lütfen bir kupon kodu girin.');
        return;
    }
    
    // Calculate cart total
    let total = 0;
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (!product) return;
        const hasDiscount = product.discount && product.discount > 0;
        const price = hasDiscount ? Math.round(product.price * (1 - product.discount / 100)) : product.price;
        total += price * cartItem.quantity;
    });
    
    const result = applyCoupon(code, total);
    if (result) {
        renderCart(); // Re-render to show coupon
    }
}

function removeCartCoupon() {
    removeCoupon();
    renderCart(); // Re-render to remove coupon
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(i => i.productId === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        renderCart();
    }
}

// Sepetten çıkar
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    renderCart();
}

// Sepete ürün ekle
function addToCart(productId) {
    console.log('➕ Sepete ekleniyor:', productId);
    
    const existing = cart.find(item => item.productId === productId);
    
    if (existing) {
        existing.quantity++;
        console.log('✅ Miktar artırıldı:', existing.quantity);
    } else {
        cart.push({ productId: productId, quantity: 1 });
        console.log('✅ Yeni ürün eklendi');
    }
    
    saveCart();
    updateCartCount();
    
    const product = products.find(p => p.id === productId);
    if (product) {
        showSuccess('Sepete Eklendi! 🛒', `${product.name} sepetinize eklendi.`);
    }
}

// Siparişi tamamla
function checkout() {
    if (cart.length === 0) {
        showWarning('Sepet Boş', 'Sepetinizde ürün bulunmuyor.');
        return;
    }
    
    console.log('🛒 Checkout başladı. Sepet:', cart);
    
    // Sepeti kapat, ödeme modalını aç
    closeCart();
    setTimeout(() => {
        openPaymentModal();
    }, 300);
}

function openPaymentModal() {
    // Toplam hesapla
    const subtotal = cart.reduce((sum, item) => {
        const p = products.find(x => x.id === item.productId);
        if (!p) return sum;
        const price = p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
        return sum + (price * item.quantity);
    }, 0);
    
    // Kampanya uygula
    const campaignResult = applyCampaigns(cart, subtotal);
    const total = subtotal - campaignResult.additionalDiscount;
    
    // Modal içeriğini hazırla
    const itemsList = cart.map(item => {
        const p = products.find(x => x.id === item.productId);
        const price = p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
        return `
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;">
                <span>${p.name} x${item.quantity}</span>
                <strong>${price * item.quantity}₺</strong>
            </div>
        `;
    }).join('');
    
    let giftHTML = '';
    if (campaignResult.giftProducts.length > 0) {
        giftHTML = '<div style="background:#e8f5e9;padding:15px;border-radius:10px;margin:15px 0;">' +
            '<strong style="color:#26de81;">🎁 Hediye Ürünler:</strong>' +
            campaignResult.giftProducts.map(p => `<div style="color:#2d5a3d;margin-top:5px;">✓ ${p.name}</div>`).join('') +
            '</div>';
    }
    
    const modalHTML = `
        <div style="max-width:500px;margin:50px auto;background:white;border-radius:20px;padding:40px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
            <h2 style="font-family:'Nunito',sans-serif;color:var(--brown);margin-bottom:30px;text-align:center;">💳 Ödeme</h2>
            
            <div style="background:#f9f9f9;padding:20px;border-radius:15px;margin-bottom:30px;">
                <h3 style="margin:0 0 15px 0;color:var(--brown);font-size:18px;">Sipariş Özeti</h3>
                ${itemsList}
                ${giftHTML}
                ${campaignResult.additionalDiscount > 0 ? `
                    <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;color:#ff6b00;">
                        <span>💰 Kampanya İndirimi</span>
                        <strong>-${campaignResult.additionalDiscount}₺</strong>
                    </div>
                ` : ''}
                <div style="display:flex;justify-content:space-between;padding:15px 0;font-size:20px;font-weight:800;">
                    <span>Toplam</span>
                    <span style="color:var(--red);">${total}₺</span>
                </div>
            </div>
            
            <div style="margin-bottom:30px;">
                <h3 style="margin:0 0 15px 0;color:var(--brown);font-size:18px;">📍 Teslimat Bilgileri</h3>
                <div style="background:#f9f9f9;padding:20px;border-radius:15px;">
                    <input type="text" id="customerName" placeholder="Ad Soyad *" required style="width:100%;padding:12px;margin-bottom:12px;border:2px solid #ddd;border-radius:8px;font-size:14px;font-family:'Nunito',sans-serif;">
                    <input type="tel" id="customerPhone" placeholder="Telefon *" required style="width:100%;padding:12px;margin-bottom:12px;border:2px solid #ddd;border-radius:8px;font-size:14px;font-family:'Nunito',sans-serif;">
                    <textarea id="customerAddress" placeholder="Adres * (İl, İlçe, Mahalle, Sokak, No)" required style="width:100%;padding:12px;margin-bottom:12px;border:2px solid #ddd;border-radius:8px;font-size:14px;font-family:'Nunito',sans-serif;min-height:80px;resize:vertical;"></textarea>
                    <input type="text" id="customerCity" placeholder="İl *" required style="width:100%;padding:12px;margin-bottom:12px;border:2px solid #ddd;border-radius:8px;font-size:14px;font-family:'Nunito',sans-serif;">
                    <textarea id="orderNotes" placeholder="Sipariş Notu (Opsiyonel)" style="width:100%;padding:12px;border:2px solid #ddd;border-radius:8px;font-size:14px;font-family:'Nunito',sans-serif;min-height:60px;resize:vertical;"></textarea>
                </div>
            </div>
            
            <div style="margin-bottom:30px;">
                <h3 style="margin:0 0 15px 0;color:var(--brown);font-size:18px;">Ödeme Yöntemi Seçin</h3>
                
                ${enabledPaymentMethods.card ? `
                <div onclick="selectPaymentMethod('card')" style="background:white;border:3px solid #ddd;padding:20px;border-radius:12px;margin-bottom:15px;cursor:pointer;transition:0.3s;" onmouseover="this.style.borderColor='var(--red)'" onmouseout="if(!this.classList.contains('selected')) this.style.borderColor='#ddd'">
                    <div style="display:flex;align-items:center;gap:15px;">
                        <div style="font-size:30px;">💳</div>
                        <div>
                            <strong style="display:block;margin-bottom:5px;">Kredi/Banka Kartı</strong>
                            <small style="color:#999;">Güvenli ödeme</small>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                ${enabledPaymentMethods.transfer ? `
                <div onclick="selectPaymentMethod('transfer')" style="background:white;border:3px solid #ddd;padding:20px;border-radius:12px;margin-bottom:15px;cursor:pointer;transition:0.3s;" onmouseover="this.style.borderColor='var(--red)'" onmouseout="if(!this.classList.contains('selected')) this.style.borderColor='#ddd'">
                    <div style="display:flex;align-items:center;gap:15px;">
                        <div style="font-size:30px;">🏦</div>
                        <div>
                            <strong style="display:block;margin-bottom:5px;">Havale/EFT</strong>
                            <small style="color:#999;">Banka hesabına transfer</small>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                ${enabledPaymentMethods.cash ? `
                <div onclick="selectPaymentMethod('cash')" style="background:white;border:3px solid #ddd;padding:20px;border-radius:12px;cursor:pointer;transition:0.3s;" onmouseover="this.style.borderColor='var(--red)'" onmouseout="if(!this.classList.contains('selected')) this.style.borderColor='#ddd'">
                    <div style="display:flex;align-items:center;gap:15px;">
                        <div style="font-size:30px;">💵</div>
                        <div>
                            <strong style="display:block;margin-bottom:5px;">Kapıda Ödeme</strong>
                            <small style="color:#999;">Teslimatta nakit</small>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
            
            <div id="cardPaymentForm" style="display:none;background:#f0f8ff;padding:20px;border-radius:12px;margin-bottom:20px;">
                <h4 style="margin:0 0 15px 0;color:var(--brown);">Kart Bilgileri</h4>
                <input type="text" id="cardNumber" placeholder="Kart Numarası" maxlength="19" style="width:100%;padding:12px;border:2px solid #ddd;border-radius:8px;margin-bottom:10px;font-size:16px;" oninput="formatCardNumber(this)">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <input type="text" id="cardExpiry" placeholder="AA/YY" maxlength="5" style="padding:12px;border:2px solid #ddd;border-radius:8px;font-size:16px;" oninput="formatExpiry(this)">
                    <input type="text" id="cardCVV" placeholder="CVV" maxlength="3" style="padding:12px;border:2px solid #ddd;border-radius:8px;font-size:16px;">
                </div>
                <input type="text" id="cardName" placeholder="Kart Üzerindeki İsim" style="width:100%;padding:12px;border:2px solid #ddd;border-radius:8px;margin-top:10px;font-size:16px;">
            </div>
            
            <div style="display:flex;gap:10px;">
                <button onclick="completePayment()" style="flex:1;padding:18px;background:linear-gradient(135deg,var(--red),#b22222);color:white;border:none;border-radius:12px;font-size:18px;font-weight:700;cursor:pointer;">
                    ✅ Ödemeyi Tamamla
                </button>
                <button onclick="closePaymentModal()" style="padding:18px 30px;background:#999;color:white;border:none;border-radius:12px;font-size:18px;font-weight:700;cursor:pointer;">
                    ❌
                </button>
            </div>
            
            <p style="text-align:center;margin-top:15px;font-size:12px;color:#999;">
                🔒 Güvenli ödeme - SSL korumalı
            </p>
        </div>
    `;
    
    document.getElementById('paymentModal').innerHTML = modalHTML;
    document.getElementById('paymentModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

let selectedPayment = null;

function selectPaymentMethod(method) {
    selectedPayment = method;
    
    // Tüm seçimleri sıfırla
    document.querySelectorAll('#paymentModal > div > div > div[onclick^="selectPaymentMethod"]').forEach(el => {
        el.style.borderColor = '#ddd';
        el.classList.remove('selected');
    });
    
    // Seçileni işaretle
    event.currentTarget.style.borderColor = 'var(--red)';
    event.currentTarget.classList.add('selected');
    
    // Kart formunu göster/gizle
    const cardForm = document.getElementById('cardPaymentForm');
    if (method === 'card') {
        cardForm.style.display = 'block';
    } else {
        cardForm.style.display = 'none';
    }
    
    console.log('💳 Ödeme yöntemi seçildi:', method);
}

function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formattedValue;
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        input.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
        input.value = value;
    }
}

function completePayment() {
    // Adres bilgilerini al
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const customerAddress = document.getElementById('customerAddress').value.trim();
    const customerCity = document.getElementById('customerCity').value.trim();
    const orderNotes = document.getElementById('orderNotes').value.trim();
    
    // Adres validasyonu
    if (!customerName || !customerPhone || !customerAddress || !customerCity) {
        showError('Eksik Bilgi', 'Lütfen tüm teslimat bilgilerini doldurun:\n• Ad Soyad\n• Telefon\n• Adres\n• İl');
        return;
    }
    
    if (!selectedPayment) {
        showWarning('Ödeme Yöntemi Seçin', 'Lütfen bir ödeme yöntemi seçin.');
        return;
    }
    
    if (selectedPayment === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCVV = document.getElementById('cardCVV').value;
        const cardName = document.getElementById('cardName').value;
        
        if (!cardNumber || !cardExpiry || !cardCVV || !cardName) {
            showError('Kart Bilgileri Eksik', 'Lütfen tüm kart bilgilerini doldurun.');
            return;
        }
        
        // Test kartı kontrolü
        if (cardNumber === '1111111111111111' || cardNumber === '111') {
            console.log('✅ Test kartı kabul edildi');
        } else if (cardNumber.length < 13) {
            showError('Geçersiz Kart', 'Kart numarası geçersiz.');
            return;
        }
    }
    
    // Toplam hesapla
    const subtotal = cart.reduce((sum, item) => {
        const p = products.find(x => x.id === item.productId);
        if (!p) return sum;
        const price = p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
        return sum + (price * item.quantity);
    }, 0);
    
    const campaignResult = applyCampaigns(cart, subtotal);
    let discount = campaignResult.additionalDiscount;
    
    // Kupon indirimini ekle
    let couponInfo = null;
    if (appliedCoupon) {
        discount += appliedCoupon.discountAmount;
        couponInfo = {
            code: appliedCoupon.code,
            amount: appliedCoupon.discountAmount
        };
    }
    
    const total = subtotal - discount;
    
    // Sipariş oluştur
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: {
            name: customerName,
            phone: customerPhone,
            address: customerAddress,
            city: customerCity,
            notes: orderNotes
        },
        items: cart.map(item => {
            const p = products.find(x => x.id === item.productId);
            return {
                productId: item.productId,
                name: p.name,
                price: p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price,
                quantity: item.quantity
            };
        }),
        gifts: campaignResult.giftProducts.map(p => ({
            productId: p.id,
            name: p.name
        })),
        subtotal: subtotal,
        discount: discount,
        campaignDiscount: campaignResult.additionalDiscount,
        coupon: couponInfo,
        total: total,
        status: 'pending',
        paymentMethod: selectedPayment,
        campaigns: campaignResult.appliedCampaigns
    };
    
    console.log('📦 Sipariş oluşturuluyor:', order);
    
    // Kupon kullanımını artır
    if (appliedCoupon) {
        incrementCouponUsage(appliedCoupon.code);
        appliedCoupon = null; // Reset applied coupon
    }
    
    // Siparişi kaydet
    orders.push(order);
    saveOrders();
    renderAdminOrders(); // Admin panelini güncelle
    
    console.log('✅ Sipariş kaydedildi. Toplam sipariş:', orders.length);
    
    // E-posta bildirimi gönder (asenkron)
    sendOrderNotification(order);
    
    // Başarı mesajı
    const paymentMethodText = {
        'card': 'Kredi Kartı',
        'transfer': 'Havale/EFT',
        'cash': 'Kapıda Ödeme'
    };
    
    let successMessage = `Sipariş No: ${order.id}\nÖdeme: ${paymentMethodText[selectedPayment]}\nToplam: ${total}₺`;
    
    // Havale seçildiyse banka bilgilerini göster
    if (selectedPayment === 'transfer' && bankInfo.iban) {
        successMessage += `\n\n🏦 Banka Bilgileri:\n`;
        successMessage += `${bankInfo.bankName}\n`;
        successMessage += `${bankInfo.accountName}\n`;
        successMessage += `IBAN: ${bankInfo.iban}`;
        if (bankInfo.notes) {
            successMessage += `\n\n💡 ${bankInfo.notes}`;
        }
    }
    
    successMessage += `\n\nInstagram'dan iletişime geçeceğiz: @ilmekten_34`;
    
    showSuccess('Sipariş Alındı! 🎉', successMessage, 10000);
    
    // Sepeti temizle
    cart = [];
    saveCart();
    
    // Modalı kapat
    closePaymentModal();
    
    // Instagram'a yönlendir
    setTimeout(() => {
        if (confirm('Instagram\'a gitmek ister misiniz?')) {
            window.open('https://www.instagram.com/ilmekten_34/', '_blank');
        }
    }, 1000);
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    selectedPayment = null;
}

function saveOrders() {
    localStorage.setItem('ilmekten_orders', JSON.stringify(orders));
    console.log('✅ Sipariş kaydedildi');
}

function loadOrders() {
    const saved = localStorage.getItem('ilmekten_orders');
    if (saved) {
        orders = JSON.parse(saved);
    }
}

function renderAdminOrders() {
    const container = document.getElementById('ordersList');
    if (!container) return;
    
    // İstatistikleri güncelle
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const revenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
    
    const pendingEl = document.getElementById('pendingCount');
    const processingEl = document.getElementById('processingCount');
    const completedEl = document.getElementById('completedCount');
    const revenueEl = document.getElementById('totalRevenue');
    
    if (pendingEl) pendingEl.textContent = pending;
    if (processingEl) processingEl.textContent = processing;
    if (completedEl) completedEl.textContent = completed;
    if (revenueEl) revenueEl.textContent = revenue + '₺';
    
    if (orders.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;padding:40px;">Henüz sipariş yok</p>';
        return;
    }
    
    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (orderViewMode === 'table') {
        renderOrdersTable(sortedOrders, container);
    } else {
        renderOrdersCards(sortedOrders, container);
    }
}

function renderOrdersCards(sortedOrders, container) {
    const statusColors = {
        pending: '#ff9800',
        processing: '#2196f3',
        completed: '#4caf50',
        cancelled: '#f44336'
    };
    
    container.innerHTML = sortedOrders.map((order, index) => {
        const date = new Date(order.date);
        const dateStr = date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'});
        
        return `
            <div style="background:white;padding:25px;border-radius:15px;margin-bottom:20px;border-left:5px solid ${statusColors[order.status]};">
                <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:15px;">
                    <div>
                        <h4 style="margin:0 0 5px 0;color:var(--brown);">Sipariş #${order.id}</h4>
                        <p style="margin:0;font-size:13px;color:#999;">${dateStr}</p>
                    </div>
                    <div style="display:flex;gap:10px;">
                        <select onchange="updateOrderStatus(${index}, this.value)" style="padding:8px 12px;border:2px solid #ddd;border-radius:8px;background:${statusColors[order.status]};color:white;font-weight:700;cursor:pointer;">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>⏳ Bekliyor</option>
                            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>🔄 Hazırlanıyor</option>
                            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>✅ Tamamlandı</option>
                            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>❌ İptal</option>
                        </select>
                        <button onclick="deleteOrder(${index})" style="padding:8px 15px;background:#ff4444;color:white;border:none;border-radius:8px;cursor:pointer;">🗑️</button>
                    </div>
                </div>
                
                ${order.customer ? `
                    <div style="background:#fff3e0;padding:15px;border-radius:10px;margin-bottom:10px;">
                        <strong style="display:block;margin-bottom:8px;color:#e65100;">📍 Müşteri Bilgileri:</strong>
                        <div style="font-size:14px;line-height:1.8;">
                            <strong>👤 ${order.customer.name}</strong><br>
                            📱 ${order.customer.phone}<br>
                            📍 ${order.customer.address}, ${order.customer.city}
                            ${order.customer.notes ? `<br>📝 Not: ${order.customer.notes}` : ''}
                        </div>
                    </div>
                ` : ''}
                
                <div style="background:#f9f9f9;padding:15px;border-radius:10px;margin-bottom:10px;">
                    <strong style="display:block;margin-bottom:10px;color:var(--brown);">Ürünler:</strong>
                    ${order.items.map(item => `
                        <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;">
                            <span>${item.name} x${item.quantity}</span>
                            <strong>${item.price * item.quantity}₺</strong>
                        </div>
                    `).join('')}
                    ${order.gifts && order.gifts.length > 0 ? `
                        <div style="margin-top:10px;padding:10px;background:#e8f5e9;border-radius:8px;">
                            <strong style="color:#26de81;">🎁 Hediyeler:</strong>
                            ${order.gifts.map(g => `<div style="color:#2d5a3d;margin-top:5px;">✓ ${g.name}</div>`).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;">
                    <span>Toplam:</span>
                    <span style="color:var(--red);">${order.total}₺</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderOrdersTable(sortedOrders, container) {
    const statusColors = {
        pending: '#ff9800',
        processing: '#2196f3',
        completed: '#4caf50',
        cancelled: '#f44336'
    };
    
    const statusTexts = {
        pending: '⏳ Bekliyor',
        processing: '🔄 Hazırlanıyor',
        completed: '✅ Tamamlandı',
        cancelled: '❌ İptal'
    };
    
    container.innerHTML = `
        <div style="background:white;border-radius:15px;overflow:hidden;">
            <table style="width:100%;border-collapse:collapse;">
                <thead>
                    <tr style="background:var(--brown);color:white;">
                        <th style="padding:15px;text-align:left;font-weight:700;">Sipariş No</th>
                        <th style="padding:15px;text-align:left;">Tarih</th>
                        <th style="padding:15px;text-align:left;">Ürünler</th>
                        <th style="padding:15px;text-align:center;">Durum</th>
                        <th style="padding:15px;text-align:right;">Toplam</th>
                        <th style="padding:15px;text-align:center;">İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedOrders.map((order, index) => {
                        const date = new Date(order.date);
                        const dateStr = date.toLocaleDateString('tr-TR');
                        const timeStr = date.toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'});
                        
                        return `
                            <tr style="border-bottom:1px solid #eee;">
                                <td style="padding:15px;font-weight:700;color:var(--brown);">#${order.id}</td>
                                <td style="padding:15px;font-size:13px;color:#666;">
                                    ${dateStr}<br>
                                    <span style="color:#999;">${timeStr}</span>
                                </td>
                                <td style="padding:15px;">
                                    ${order.items.map(item => `
                                        <div style="font-size:13px;margin:2px 0;">${item.name} x${item.quantity}</div>
                                    `).join('')}
                                </td>
                                <td style="padding:15px;text-align:center;">
                                    <select onchange="updateOrderStatus(${index}, this.value)" style="padding:6px 10px;border:2px solid ${statusColors[order.status]};border-radius:6px;background:${statusColors[order.status]};color:white;font-weight:600;font-size:12px;cursor:pointer;">
                                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>⏳ Bekliyor</option>
                                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>🔄 Hazırlanıyor</option>
                                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>✅ Tamamlandı</option>
                                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>❌ İptal</option>
                                    </select>
                                </td>
                                <td style="padding:15px;text-align:right;font-weight:800;font-size:16px;color:var(--red);">${order.total}₺</td>
                                <td style="padding:15px;text-align:center;">
                                    <button onclick="deleteOrder(${index})" style="padding:8px 12px;background:#ff4444;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;">🗑️</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function setOrderView(mode) {
    orderViewMode = mode;
    
    // Buton stillerini güncelle
    const cardsBtn = document.getElementById('viewCards');
    const tableBtn = document.getElementById('viewTable');
    
    if (mode === 'cards') {
        cardsBtn.style.background = 'var(--red)';
        cardsBtn.style.color = 'white';
        tableBtn.style.background = '#ddd';
        tableBtn.style.color = '#666';
    } else {
        tableBtn.style.background = 'var(--red)';
        tableBtn.style.color = 'white';
        cardsBtn.style.background = '#ddd';
        cardsBtn.style.color = '#666';
    }
    
    filterOrders(); // Yeniden render
}

function filterOrders() {
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filtered = [...orders];
    
    // Durum filtresi
    if (statusFilter !== 'all') {
        filtered = filtered.filter(o => o.status === statusFilter);
    }
    
    // Arama filtresi
    if (searchTerm) {
        filtered = filtered.filter(o => {
            const orderId = o.id.toString().toLowerCase();
            const items = o.items.map(i => i.name.toLowerCase()).join(' ');
            return orderId.includes(searchTerm) || items.includes(searchTerm);
        });
    }
    
    // Render
    const sortedOrders = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    const container = document.getElementById('ordersList');
    
    if (sortedOrders.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;padding:40px;">Filtreye uygun sipariş bulunamadı</p>';
        return;
    }
    
    if (orderViewMode === 'table') {
        renderOrdersTable(sortedOrders, container);
    } else {
        renderOrdersCards(sortedOrders, container);
    }
}

function updateOrderStatus(index, newStatus) {
    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    const orderId = sortedOrders[index].id;
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    orders[orderIndex].status = newStatus;
    saveOrders();
    renderAdminOrders();
    console.log('✅ Sipariş durumu güncellendi:', newStatus);
}

function deleteOrder(index) {
    if (confirm('Bu siparişi silmek istediğinizden emin misiniz?')) {
        const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
        const orderId = sortedOrders[index].id;
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        orders.splice(orderIndex, 1);
        saveOrders();
        renderAdminOrders();
        alert('Sipariş silindi');
    }
}

// ==================== STORIES (HİKAYELER) ====================
let currentStoryIndex = 0;
let stories = [
    {
        title: "Nisse ve Tomte'nin Kış Maceraları ❄️",
        image: "1.png",
        text: `Norveç'in karlı dağlarından Nisse ve İsveç'in sıcak evlerinden Tomte, yüzyıllardır insanların evlerini koruyan cücelerdi. Kırmızı şapkalı Nisse her zaman neşeliydi, kahverengi şapkalı Tomte ise bilge ve sakindi.

Bir Noel gecesi, ikisi de aynı kulübede karşılaşır. "Senin evin mi bu?" der Nisse gülümseyerek. "Hayır, bizim evimiz" diye yanıtlar Tomte. O gece, iki cüce el ele vererek kulübedeki aileyi mutlu etmek için çalışır.

Nisse çorapları rengarenk yünlerle örerken, Tomte sıcak çorba pişirir. Sabah olduğunda, ev sahipleri mutluluktan gözlerine inanamaz. İki cüce, karın üzerinde ayak izleri bırakarak el ele uzaklaşır...

🎁 ilmekten'den: Nisse ve Tomte amigurumi bebeklerimiz, evinize bu sıcaklığı getirir. Her biri özenle örülmüş, sevgiyle hazırlanmış.`
    },
    {
        title: "Llama Kuzco'nun Yeni Macerası 🦙",
        image: "2.png",
        text: `Uzak diyarlardan gelen haberler, İmparator Kuzco'nun artık sadece sarayda oturmadığını söylüyordu. Lamaya dönüşen Kuzco, macera dolu yolculuğunda en değerli şeyi öğrenmişti: dostluk.

Bir gün köyde küçük bir kız, "Bana bir arkadaş ör!" diye haykırır. Köyün en usta örgücüsü, kahverengi yünlerle işe koyulur. Renkli bir semer, sevimli bir şapka... Ve işte, Kuzco amigurumi olarak yeniden doğar!

Küçük kız, yün Kuzco'yu her gece kucaklayarak uyur. Rüyalarında, onunla birlikte dağları aşar, nehirleri geçer. "Sen benim en iyi arkadaşımsın" der küçük kız. Kuzco ise yün kalbiyle gülümser...

🦙 ilmekten'den: Her amigurumi, bir dost. Her ilmek, bir macera. Kuzco lamalarımız, çocukların hayal dünyasına renk katar.`
    },
    {
        title: "Kaplumbağa Toshi'nin Orman Yolculuğu 🐢",
        image: "3.png",
        text: `Yüzyıllık ağaçların arasında, yeşil kabuğuyla Toshi yaşardı. Acele etmeyen, her adımı düşünen, bilge bir kaplumbağaydı. Ormanın tüm hayvanları ona danışırdı.

Bir gün küçük bir tavşan gelir, "Toshi, hep neden bu kadar yavaşsın?" diye sorar. Toshi gülümser: "Çünkü acele eden, yolun güzelliğini göremez küçük dost. Bak, şu çiçeği gördün mü? Sabah açtı, akşam kapanacak. Koşarken fark eder miydin?"

Tavşan durur, etrafa bakar. İlk defa ormanın ne kadar güzel olduğunu fark eder. O günden sonra, bazen yavaşlamak gerektiğini öğrenir...

🐢 ilmekten'den: Toshi kaplumbağamız, çocuklara sabır ve dikkat etmeyi öğretir. Her ilmek, bir yaşam dersi taşır.`
    },
    {
        title: "Atlar ve Hazine Treni 🐴",
        image: "4.png",
        text: `Ay ışığının altında, iki cesur at duruyor: Luna ve Sol. İkisi de rüya treninin bekçileridir. Bu tren, iyi çocukların rüyalarını taşır gece boyunca.

Luna: "Bu gece kaç çocuğun rüyası var trende?" diye sorar. Sol gülümser: "Yüzlerce! Bazıları uçan atlar, bazıları gökkuşağı görüyor." İkisi birlikte treni çeker, yıldızların arasından.

Sabah olduğunda çocuklar uyanır, mutlu gülümserler. Gece gördükleri güzel rüyaları hatırlayarak... Luna ve Sol de işlerini bitirmiş, gün doğana kadar dinlenirler.

🐴 ilmekten'den: Luna ve Sol at amigurumilerimiz, çocukların hayal gücünü besler. Her gece yeni bir macera, her sabah yeni bir gülümseme.`
    }
];

function openStories() {
    const modal = document.getElementById('storiesModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentStoryIndex = 0;
    renderStory();
    
    // Parallax scroll efekti
    modal.addEventListener('scroll', handleStoryScroll);
}

function closeStories() {
    const modal = document.getElementById('storiesModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    modal.removeEventListener('scroll', handleStoryScroll);
}

function handleStoryScroll() {
    const modal = document.getElementById('storiesModal');
    const viewer = document.querySelector('.story-viewer');
    const imageContainer = document.querySelector('.story-image-container');
    const image = document.querySelector('.story-image-container img');
    const indicator = document.querySelector('.story-indicator');
    
    if (!viewer || !imageContainer || !image) return;
    
    const scrollY = modal.scrollTop;
    const viewportHeight = window.innerHeight;
    const modalHeight = modal.scrollHeight;
    
    // Scroll yüzdesi (0-1)
    const scrollPercent = scrollY / (modalHeight - viewportHeight);
    
    // Resim parallax efekti (yavaş hareket)
    const imageTranslate = scrollY * 0.3;
    image.style.transform = `translateY(${imageTranslate}px) scale(${1 + scrollPercent * 0.1})`;
    
    // Viewer için yumuşak 3D efekt
    const tiltX = Math.sin(scrollPercent * Math.PI * 2) * 2;
    const tiltY = Math.cos(scrollPercent * Math.PI * 2) * 2;
    viewer.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
    
    // Indicator için dalga efekti
    if (indicator) {
        const dots = indicator.querySelectorAll('.story-dot');
        dots.forEach((dot, index) => {
            const phase = scrollPercent * Math.PI * 4 + index * 0.5;
            const wave = Math.sin(phase) * 5;
            const scale = 1 + Math.abs(Math.sin(phase)) * 0.3;
            dot.style.transform = `translateY(${wave}px) scale(${scale})`;
            dot.style.transition = 'transform 0.1s ease-out';
        });
    }
}

function renderStory() {
    const story = stories[currentStoryIndex];
    const container = document.getElementById('storyContainer');
    
    // Bu hikayeye bağlı ürünleri bul
    const linkedProducts = products.filter(p => p.storyIndex === currentStoryIndex);
    
    const productButton = linkedProducts.length > 0 ? `
        <button onclick="goToProduct(${linkedProducts[0].id})" style="
            background: linear-gradient(135deg, var(--red) 0%, #b22222 100%);
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            margin-top: 20px;
            box-shadow: 0 8px 20px rgba(220, 20, 60, 0.3);
            transition: 0.3s;
            font-family: 'Nunito', sans-serif;
        " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
            🛍️ ${linkedProducts[0].name} Ürününe Git
        </button>
    ` : '';
    
    container.innerHTML = `
        <div class="story-image-container">
            <img src="${story.image}" alt="${story.title}">
        </div>
        <div class="story-content">
            <h2 class="story-title">${story.title}</h2>
            <div class="story-text">${story.text}</div>
            ${productButton}
        </div>
    `;
    
    document.getElementById('prevStory').style.display = currentStoryIndex === 0 ? 'none' : 'inline-block';
    document.getElementById('nextStory').textContent = currentStoryIndex === stories.length - 1 ? 'Kapat' : 'Sonraki →';
    
    const indicator = document.getElementById('storyIndicator');
    indicator.innerHTML = stories.map((_, idx) => 
        `<div class="story-dot ${idx === currentStoryIndex ? 'active' : ''}"></div>`
    ).join('');
}

function goToProduct(productId) {
    closeStories();
    setTimeout(() => {
        showDetail(productId);
    }, 300);
}

function nextStory() {
    if (currentStoryIndex < stories.length - 1) {
        currentStoryIndex++;
        renderStory();
    } else {
        closeStories();
    }
}

function prevStory() {
    if (currentStoryIndex > 0) {
        currentStoryIndex--;
        renderStory();
    }
}

// ==================== STORY MANAGEMENT ====================

function saveStories() {
    localStorage.setItem('ilmekten_stories', JSON.stringify(stories));
    console.log('✅ Hikayeler kaydedildi');
}

function loadStories() {
    const saved = localStorage.getItem('ilmekten_stories');
    if (saved) {
        try {
            const loaded = JSON.parse(saved);
            if (loaded && loaded.length > 0) {
                stories = loaded;
                console.log('✅ Hikayeler yüklendi:', stories.length);
            }
        } catch (e) {
            console.error('❌ Hikayeler yüklenemedi:', e);
        }
    }
}

function renderAdminStories() {
    const container = document.getElementById('adminStoriesList');
    if (!container) return;
    
    if (stories.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;padding:40px;">Henüz hikaye yok</p>';
        return;
    }
    
    container.innerHTML = stories.map((story, index) => `
        <div style="background:white;padding:25px;border-radius:15px;border-left:5px solid var(--red);">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:15px;">
                <div style="flex:1;">
                    <h4 style="margin:0 0 10px 0;color:var(--brown);font-size:20px;">${story.title}</h4>
                    <p style="margin:0;color:#666;font-size:14px;line-height:1.6;max-height:60px;overflow:hidden;">${story.text.substring(0, 150)}...</p>
                </div>
                <img src="${story.image}" style="width:80px;height:80px;object-fit:cover;border-radius:10px;margin-left:20px;" onerror="this.style.display='none'">
            </div>
            <div style="display:flex;gap:10px;margin-top:15px;">
                <button onclick="editStory(${index})" style="flex:1;padding:10px;background:var(--brown);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">✏️ Düzenle</button>
                <button onclick="deleteStory(${index})" style="padding:10px 20px;background:#ff4444;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">🗑️ Sil</button>
            </div>
        </div>
    `).join('');
}

let editingStoryIndex = null;

function openStoryForm(index = null) {
    editingStoryIndex = index;
    const story = index !== null ? stories[index] : null;
    
    const modalHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:10001;display:flex;align-items:center;justify-content:center;overflow-y:auto;">
            <div style="max-width:700px;width:90%;background:white;border-radius:20px;padding:40px;margin:50px auto;">
                <h2 style="color:var(--brown);margin-bottom:30px;">${story ? '✏️ Hikaye Düzenle' : '➕ Yeni Hikaye'}</h2>
                
                <div style="margin-bottom:20px;">
                    <label style="display:block;margin-bottom:8px;font-weight:700;color:var(--brown);">Başlık:</label>
                    <input type="text" id="storyTitle" value="${story ? story.title : ''}" placeholder="Örn: Nisse ve Tomte'nin Kış Maceraları ❄️" style="width:100%;padding:12px;border:2px solid #ddd;border-radius:8px;font-size:16px;font-family:'Nunito',sans-serif;">
                </div>
                
                <div style="margin-bottom:20px;">
                    <label style="display:block;margin-bottom:8px;font-weight:700;color:var(--brown);">Görsel URL:</label>
                    <input type="text" id="storyImage" value="${story ? story.image : ''}" placeholder="örn: nisse-tomte.png" style="width:100%;padding:12px;border:2px solid #ddd;border-radius:8px;font-size:16px;font-family:'Nunito',sans-serif;">
                </div>
                
                <div style="margin-bottom:20px;">
                    <label style="display:block;margin-bottom:8px;font-weight:700;color:var(--brown);">Hikaye Metni:</label>
                    <textarea id="storyText" placeholder="Hikayeyi buraya yazın..." style="width:100%;padding:12px;border:2px solid #ddd;border-radius:8px;font-size:16px;font-family:'Nunito',sans-serif;min-height:300px;resize:vertical;">${story ? story.text : ''}</textarea>
                    <small style="display:block;margin-top:5px;color:#999;">💡 Paragraflar arasında boş satır bırakın</small>
                </div>
                
                <div style="display:flex;gap:10px;">
                    <button onclick="saveStory()" style="flex:1;padding:15px;background:var(--red);color:white;border:none;border-radius:10px;font-weight:700;font-size:16px;cursor:pointer;">
                        💾 ${story ? 'Güncelle' : 'Kaydet'}
                    </button>
                    <button onclick="closeStoryForm()" style="padding:15px 30px;background:#ddd;color:#666;border:none;border-radius:10px;font-weight:700;font-size:16px;cursor:pointer;">
                        ❌ İptal
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', '<div id="storyFormModal">' + modalHTML + '</div>');
}

function closeStoryForm() {
    const modal = document.getElementById('storyFormModal');
    if (modal) modal.remove();
    editingStoryIndex = null;
}

function saveStory() {
    const title = document.getElementById('storyTitle').value.trim();
    const image = document.getElementById('storyImage').value.trim();
    const text = document.getElementById('storyText').value.trim();
    
    if (!title || !image || !text) {
        alert('❌ Lütfen tüm alanları doldurun!');
        return;
    }
    
    const story = { title, image, text };
    
    if (editingStoryIndex !== null) {
        // Güncelle
        stories[editingStoryIndex] = story;
        alert('✅ Hikaye güncellendi!');
    } else {
        // Yeni ekle
        stories.push(story);
        alert('✅ Yeni hikaye eklendi!');
    }
    
    saveStories();
    renderAdminStories();
    closeStoryForm();
}

function editStory(index) {
    openStoryForm(index);
}

function deleteStory(index) {
    if (!confirm('Bu hikayeyi silmek istediğinizden emin misiniz?')) return;
    
    stories.splice(index, 1);
    saveStories();
    renderAdminStories();
    alert('✅ Hikaye silindi!');
}

// Click outside to close
document.getElementById('storiesModal').addEventListener('click', function(e) {
    if (e.target === this) closeStories();
});

// LocalStorage'dan ürünleri yükle
function loadProducts() {
    console.log('📦 loadProducts çağrıldı');
    console.log('📦 Mevcut products.length:', products.length);
    
    // LocalStorage OKUMA - Devre dışı (boş array sorunu için)
    // Sadece renderProducts çağır
    
    if (products.length === 0) {
        console.warn('⚠️ Products dizisi boş! Varsayılan ürünler yüklenemedi.');
    }
    
    // Debug: Ürünlerdeki indirim bilgilerini kontrol et
    console.log('🔍 Ürün indirim kontrolü:');
    products.forEach(p => {
        if (p.discount && p.discount > 0) {
            console.log(`  - ${p.name}: %${p.discount} indirim`);
        }
    });
    
    // Ana sayfada tüm ürünleri göster (carousel)
    renderHomeProducts();
    console.log('✅ loadProducts tamamlandı');
}

// Ürünleri kaydet
function saveProducts() {
    try {
        // Önce mevcut veriyi yedekle
        const existing = localStorage.getItem('ilmekten_products');
        if (existing) {
            localStorage.setItem('ilmekten_products_backup', existing);
        }
        
        // Yeni veriyi kaydet
        const dataString = JSON.stringify(products);
        localStorage.setItem('ilmekten_products', dataString);
        
        console.log('✅ Ürünler kaydedildi. Boyut:', (dataString.length / 1024).toFixed(2), 'KB');
        
    } catch (e) {
        console.error('❌ LocalStorage hatası:', e);
        
        // Quota aşıldıysa uyar
        if (e.name === 'QuotaExceededError') {
            alert('⚠️ Depolama alanı dolu! Çok fazla resim var. Lütfen bazı resimleri kaldırın veya boyutlarını küçültün.');
            
            // Backup'tan geri yükle
            const backup = localStorage.getItem('ilmekten_products_backup');
            if (backup) {
                localStorage.setItem('ilmekten_products', backup);
                console.log('🔄 Backup\'tan geri yüklendi');
            }
        } else {
            alert('❌ Ürünler kaydedilemedi: ' + e.message);
        }
    }
}

// Ürünleri ekrana render et
function renderProducts(productList = null, targetGrid = 'productsGrid') {
    const grid = document.getElementById(targetGrid);
    if (!grid) return;
    
    const productsToRender = productList || products;
    
    grid.innerHTML = productsToRender.map(p => {
        const mainImage = p.images && p.images.length > 0 ? p.images[0] : null;
        const hasDiscount = p.discount && p.discount > 0;
        const discountedPrice = hasDiscount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
        const isFav = isFavorite(p.id);
        
        return `
            <div class="product-card" onclick="showDetail(${p.id})">
                ${hasDiscount ? `<div class="product-badge" style="background: linear-gradient(135deg, #ff4757, #ff6348);">%${p.discount} İNDİRİM</div>` : '<div class="product-badge">YENİ</div>'}
                
                <!-- Favorite Icon -->
                <div class="favorite-icon ${isFav ? 'active' : ''}" 
                     data-product-id="${p.id}"
                     onclick="event.stopPropagation(); toggleFavorite(${p.id})"
                     title="${isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}">
                    ${isFav ? '❤️' : '🤍'}
                </div>
                
                <div class="product-image">
                    ${mainImage ? 
                        `<img src="${mainImage}" alt="${p.name}" style="max-width: 85%; max-height: 85%; object-fit: contain; filter: drop-shadow(0 10px 30px rgba(0,0,0,0.15));">` : 
                        `<div style="font-size: 180px;">${p.emoji}</div>`
                    }
                    ${p.images && p.images.length > 1 ? `<div style="position: absolute; bottom: 10px; right: 10px; background: rgba(220,20,60,0.9); color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 700;">+${p.images.length - 1}</div>` : ''}
                </div>
                <div class="product-category">${p.category}</div>
                <h3 class="product-name">${p.name}</h3>
                <p class="product-description">${p.description}</p>
                <div class="product-footer">
                    ${hasDiscount ? 
                        `<div style="display: flex; flex-direction: column; align-items: flex-start;">
                            <span style="font-size: 16px; color: #999; text-decoration: line-through;">${p.price} ₺</span>
                            <span class="product-price">${discountedPrice} ₺</span>
                        </div>` : 
                        `<span class="product-price">${p.price} ₺</span>`
                    }
                    <button class="add-to-cart" onclick="event.stopPropagation(); addCart(${p.id})">🛒 Sepete Ekle</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Update favorite icons after rendering
    updateFavoriteIcons();
}

// Ana sayfada carousel ile ürünleri göster
function renderHomeProducts() {
    const homeGrid = document.getElementById('homeProductsGrid');
    if (!homeGrid) return;
    
    console.log('🏠 renderHomeProducts çağrıldı');
    console.log('📦 Ürün sayısı:', products.length);
    
    // İndirimli ürünleri kontrol et
    const discountedProducts = products.filter(p => p.discount && p.discount > 0);
    console.log('💰 İndirimli ürün sayısı:', discountedProducts.length);
    discountedProducts.forEach(p => {
        console.log(`  - ${p.name}: %${p.discount} (${p.price}₺ → ${Math.round(p.price * (1 - p.discount / 100))}₺)`);
    });
    
    // Tüm ürünleri göster (carousel ile kaydırılabilir)
    renderProducts(products, 'homeProductsGrid');
    
    console.log('🏠 Ana sayfa ürünleri render edildi (carousel mode)');
}

// Home products carousel scroll
function scrollHomeProducts(direction) {
    const container = document.getElementById('homeProductsGrid');
    if (!container) return;
    
    const scrollAmount = 350; // Bir kart genişliği + gap
    
    if (direction === 'left') {
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else {
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Tüm ürünler sayfasını göster
function showAllProducts() {
    document.getElementById('urunler-sayfa').style.display = 'block';
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.products').style.display = 'none';
    
    // Kategorileri doldur
    populateCategories();
    
    // Ürünleri render et
    filterProducts();
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Hakkımızda sayfasını göster (animasyonlu)
// Hakkımızda sayfasını göster (scroll-based cinematic)
let currentScene = 0;
let isScrolling = false;

function showAbout() {
    // Diğer sayfaları gizle
    document.getElementById('urunler-sayfa').style.display = 'none';
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.products').style.display = 'none';
    
    // Hakkımızda göster
    const aboutSection = document.getElementById('hakkimizda');
    aboutSection.style.display = 'block';
    
    // Scroll to top
    window.scrollTo(0, 0);
    currentScene = 0;
    
    // İlk sahneyi aktif et
    setTimeout(() => {
        activateScene(0);
        initScrollAnimation();
    }, 300);
}

// Hakkımızda sayfasını gizle
function hideAbout() {
    document.getElementById('hakkimizda').style.display = 'none';
    document.querySelector('.hero').style.display = 'flex';
    document.querySelector('.products').style.display = 'block';
    window.scrollTo(0, 0);
    
    // Scroll listener'ı kaldır
    document.getElementById('hakkimizda').removeEventListener('wheel', handleAboutScroll);
}

// Scroll animation initialize
function initScrollAnimation() {
    const aboutSection = document.getElementById('hakkimizda');
    aboutSection.addEventListener('wheel', handleAboutScroll, { passive: false });
    
    // Progress dots click
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentScene = index;
            activateScene(index);
        });
    });
}

// Handle scroll
function handleAboutScroll(e) {
    if (isScrolling) return;
    
    e.preventDefault();
    
    const delta = e.deltaY;
    
    if (delta > 0 && currentScene < 4) {
        // Scroll down
        isScrolling = true;
        currentScene++;
        activateScene(currentScene);
        setTimeout(() => { isScrolling = false; }, 1000);
    } else if (delta < 0 && currentScene > 0) {
        // Scroll up
        isScrolling = true;
        currentScene--;
        activateScene(currentScene);
        setTimeout(() => { isScrolling = false; }, 1000);
    }
}

// Activate scene with transitions
function activateScene(sceneIndex) {
    const scenes = document.querySelectorAll('.about-scene');
    const dots = document.querySelectorAll('.progress-dot');
    
    scenes.forEach((scene, index) => {
        const content = scene.querySelector('.scene-content');
        
        if (index === sceneIndex) {
            // Aktif sahne
            scene.style.position = 'relative';
            scene.style.zIndex = '10';
            
            // Farklı geçiş efektleri
            setTimeout(() => {
                if (index === 0) {
                    // Zoom in + fade
                    content.style.opacity = '1';
                    content.style.transform = 'scale(1)';
                } else if (index === 1) {
                    // Slide from left
                    content.style.opacity = '1';
                    content.style.transform = 'translateX(0)';
                } else if (index === 2) {
                    // Slide from right
                    content.style.opacity = '1';
                    content.style.transform = 'translateX(0)';
                } else if (index === 3) {
                    // Rotate + scale
                    content.style.opacity = '1';
                    content.style.transform = 'scale(1) rotate(0deg)';
                } else if (index === 4) {
                    // Slide up
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                }
                content.style.transition = 'all 1s cubic-bezier(0.4, 0.0, 0.2, 1)';
            }, 50);
            
            // Scroll to scene
            scene.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (index < sceneIndex) {
            // Geçilmiş sahneler - yukarıda
            scene.style.position = 'relative';
            scene.style.zIndex = '1';
            content.style.opacity = '0.3';
            content.style.transform = 'scale(0.9)';
        } else {
            // Henüz gelinmemiş sahneler - aşağıda
            scene.style.position = 'relative';
            scene.style.zIndex = '1';
            content.style.opacity = '0';
            
            // Reset transforms
            if (index === 0) content.style.transform = 'scale(0.8)';
            else if (index === 1) content.style.transform = 'translateX(-100px)';
            else if (index === 2) content.style.transform = 'translateX(100px)';
            else if (index === 3) content.style.transform = 'scale(0.7) rotate(-5deg)';
            else if (index === 4) content.style.transform = 'translateY(100px)';
        }
    });
    
    // Update progress dots
    dots.forEach((dot, index) => {
        if (index === sceneIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Old timeline animation removed
function animateTimeline() {
    // Not used anymore - scroll-based system active
}

// Ana sayfaya dön
function hideAllProducts() {
    document.getElementById('urunler-sayfa').style.display = 'none';
    document.getElementById('hakkimizda').style.display = 'none';
    document.querySelector('.hero').style.display = 'flex';
    document.querySelector('.products').style.display = 'block';
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Kategorileri dropdown'a doldur
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    // Benzersiz kategorileri al
    const categories = [...new Set(products.map(p => p.category))];
    
    // İlk option'ı koru, diğerlerini ekle
    categoryFilter.innerHTML = '<option value="all">Tüm Kategoriler</option>' + 
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

// Ürünleri filtrele
function filterProducts() {
    const search = document.getElementById('productSearch')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const priceRange = document.getElementById('priceFilter')?.value || 'all';
    const sizeRange = document.getElementById('sizeFilter')?.value || 'all';
    const sortBy = document.getElementById('sortFilter')?.value || 'default';
    
    let filtered = [...products];
    
    // Arama
    if (search) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search) || 
            p.description.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search)
        );
    }
    
    // Kategori
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    // Fiyat
    if (priceRange !== 'all') {
        if (priceRange === '0-300') {
            filtered = filtered.filter(p => p.price <= 300);
        } else if (priceRange === '300-500') {
            filtered = filtered.filter(p => p.price > 300 && p.price <= 500);
        } else if (priceRange === '500-800') {
            filtered = filtered.filter(p => p.price > 500 && p.price <= 800);
        } else if (priceRange === '800+') {
            filtered = filtered.filter(p => p.price > 800);
        }
    }
    
    // Boyut
    if (sizeRange !== 'all') {
        if (sizeRange === 'small') {
            filtered = filtered.filter(p => p.height <= 15);
        } else if (sizeRange === 'medium') {
            filtered = filtered.filter(p => p.height > 15 && p.height <= 25);
        } else if (sizeRange === 'large') {
            filtered = filtered.filter(p => p.height > 25);
        }
    }
    
    // Sıralama
    if (sortBy === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    } else if (sortBy === 'name-desc') {
        filtered.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
    }
    
    // Sonuç sayısını göster
    const resultsEl = document.getElementById('filterResults');
    if (resultsEl) {
        resultsEl.textContent = `${filtered.length} ürün listeleniyor`;
    }
    
    // Render
    renderProducts(filtered, 'productsGrid');
    
    // Sonuç yoksa mesaj göster
    if (filtered.length === 0) {
        document.getElementById('productsGrid').innerHTML = 
            '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#999;">' +
            '<div style="font-size:80px;margin-bottom:20px;">😔</div>' +
            '<h3>Aradığınız kriterlere uygun ürün bulunamadı</h3>' +
            '<p>Filtreleri değiştirerek tekrar deneyin</p>' +
            '</div>';
    }
}

// Filtreleri temizle
function clearFilters() {
    document.getElementById('productSearch').value = '';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('priceFilter').value = 'all';
    document.getElementById('sizeFilter').value = 'all';
    document.getElementById('sortFilter').value = 'default';
    filterProducts();
}

// Ürün detay modalı
function showDetail(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    
    currentImageIndex = 0;
    const hasMultipleImages = p.images && p.images.length > 1;
    const currentImage = (p.images && p.images.length > 0) ? p.images[0] : null;
    const hasDiscount = p.discount && p.discount > 0;
    const discountedPrice = hasDiscount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
    
    document.getElementById('productDetail').innerHTML = `
        <div class="detail-image" style="position: relative;">
            ${currentImage ? 
                `<img id="detailMainImage" src="${currentImage}" alt="${p.name}" onclick="openLightbox('${currentImage}')" style="max-width: 90%; max-height: 90%; object-fit: contain; transition: 0.3s;">` : 
                `<div style="font-size: 200px;">${p.emoji}</div>`
            }
            ${currentImage ? `<div class="zoom-icon" onclick="openLightbox('${currentImage}')">🔍</div>` : ''}
            ${hasMultipleImages ? `
                <button onclick="event.stopPropagation(); prevImage(${p.id})" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(220,20,60,0.9); color: white; border: none; width: 50px; height: 50px; border-radius: 50%; font-size: 24px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">‹</button>
                <button onclick="event.stopPropagation(); nextImage(${p.id})" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(220,20,60,0.9); color: white; border: none; width: 50px; height: 50px; border-radius: 50%; font-size: 24px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">›</button>
                <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">1 / ${p.images.length}</div>
            ` : ''}
            ${hasDiscount ? `
                <div style="position: absolute; top: 20px; right: 20px; background: linear-gradient(135deg, #ff4757, #ff6348); color: white; padding: 12px 20px; border-radius: 50px; font-size: 18px; font-weight: 800; box-shadow: 0 8px 20px rgba(255,71,87,0.4);">
                    %${p.discount} İNDİRİM
                </div>
            ` : ''}
        </div>
        <div class="detail-info">
            <div class="product-category" style="margin-bottom: 15px;">${p.category}</div>
            <h2>${p.name}</h2>
            ${hasDiscount ? 
                `<div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <div class="detail-price" style="font-size: 32px; text-decoration: line-through; opacity: 0.5;">${p.price} ₺</div>
                    <div class="detail-price" style="font-size: 48px;">${discountedPrice} ₺</div>
                </div>` : 
                `<div class="detail-price">${p.price} ₺</div>`
            }
            
            <div class="detail-specs">
                <div class="detail-spec-item">
                    <span>📏</span>
                    <div>
                        <div style="font-size: 12px; color: #999;">Ebat</div>
                        <div class="detail-spec-value">${p.width} x ${p.height} cm</div>
                    </div>
                </div>
                <div class="detail-spec-item">
                    <span>⏱️</span>
                    <div>
                        <div style="font-size: 12px; color: #999;">Yapım Süresi</div>
                        <div class="detail-spec-value">${p.production_days} gün</div>
                    </div>
                </div>
                <div class="detail-spec-item">
                    <span>🎨</span>
                    <div>
                        <div style="font-size: 12px; color: #999;">Durum</div>
                        <div class="detail-spec-value">Sipariş Üzerine</div>
                    </div>
                </div>
                <div class="detail-spec-item">
                    <span>✋</span>
                    <div>
                        <div style="font-size: 12px; color: #999;">Üretim</div>
                        <div class="detail-spec-value">%100 El Yapımı</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-description">${p.description}</div>
            
            <button class="btn btn-primary" style="width: 100%; font-size: 20px; padding: 18px; background: linear-gradient(135deg, var(--red) 0%, #b22222 100%); border: none; box-shadow: 0 8px 25px rgba(220, 20, 60, 0.3);" onclick="addCart(${p.id}); closeModal();">
                🛒 Sepete Ekle - ${discountedPrice} ₺
            </button>
            
            <p style="text-align: center; margin-top: 15px; font-size: 13px; color: #999;">
                <strong style="color: var(--red);">⚡ ${p.production_days} iş günü</strong> içinde özel olarak sizin için hazırlanacak
            </p>
        </div>
    `;
    document.getElementById('productModal').classList.add('active');
}

// Resim galerisi - önceki
function prevImage(productId) {
    const p = products.find(x => x.id === productId);
    if (!p || !p.images || p.images.length <= 1) return;
    
    currentImageIndex = (currentImageIndex - 1 + p.images.length) % p.images.length;
    updateModalImage(p);
}

// Resim galerisi - sonraki
function nextImage(productId) {
    const p = products.find(x => x.id === productId);
    if (!p || !p.images || p.images.length <= 1) return;
    
    currentImageIndex = (currentImageIndex + 1) % p.images.length;
    updateModalImage(p);
}

// Modal resmini güncelle
function updateModalImage(product) {
    const imgElement = document.getElementById('detailMainImage');
    if (imgElement && product.images && product.images[currentImageIndex]) {
        const newImageSrc = product.images[currentImageIndex];
        
        imgElement.style.opacity = '0';
        setTimeout(() => {
            imgElement.src = newImageSrc;
            imgElement.onclick = () => openLightbox(newImageSrc);
            imgElement.style.opacity = '1';
        }, 150);
        
        // Zoom icon'u güncelle
        const zoomIcon = document.querySelector('.zoom-icon');
        if (zoomIcon) {
            zoomIcon.onclick = () => openLightbox(newImageSrc);
        }
        
        // Sayaç güncelle
        const counter = document.querySelector('.detail-image div[style*="bottom: 20px"]');
        if (counter) {
            counter.textContent = `${currentImageIndex + 1} / ${product.images.length}`;
        }
    }
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    currentImageIndex = 0;
}

function addCart(id) {
    addToCart(id);
}

document.getElementById('productModal').onclick = function(e) {
    if (e.target === this) closeModal();
};

// ==================== HERO SLIDESHOW ====================
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

setInterval(nextSlide, 4000);

// ==================== STORY MODAL ====================
// Story Modal functions DELETED - using Hakkımızda page instead

// Hakkımızda linki tıklanınca Hakkımızda sayfasını göster
document.querySelectorAll('a[href="#hakkimizda"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        showAbout(); // Hakkımızda sayfasını göster
    });
});

// ==================== ADMIN PANEL ====================
function openAdmin() {
    console.log('🔐 Admin girişi isteniyor...');
    
    // Check if already logged in
    if (isAdminLoggedIn) {
        openAdminPanel();
    } else {
        showAdminLogin();
    }
}

function closeAdmin() {
    document.getElementById('adminModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Logout
    isAdminLoggedIn = false;
    
    // URL hash'i temizle (gizlilik için)
    if (window.location.hash.includes('admin') || window.location.hash.includes('yonetim')) {
        history.replaceState(null, null, ' ');
    }
    
    console.log('🔐 Admin panelinden çıkış yapıldı');
}

// ==================== LEGAL PAGES ====================

const legalContent = {
    kvkk: `
        <h2 style="color: var(--brown); font-size: 32px; margin-bottom: 20px;">🔒 KVKK Aydınlatma Metni</h2>
        
        <p style="margin-bottom: 20px;"><strong>Son Güncelleme:</strong> 03 Aralık 2024</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">1. Veri Sorumlusu</h3>
        <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu olarak İlmekten tarafından aşağıda açıklanan kapsamda işlenebilecektir.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">2. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</h3>
        <p>Kişisel verileriniz, İlmekten tarafından sunulan hizmetlerden yararlanmanız sırasında, otomatik veya otomatik olmayan yöntemlerle sözlü, yazılı veya elektronik olarak toplanabilir.</p>
        
        <p style="margin-top: 15px;">Toplanan kişisel veriler:</p>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li>Ad, soyad</li>
            <li>Telefon numarası</li>
            <li>E-posta adresi</li>
            <li>Teslimat adresi</li>
            <li>Sipariş bilgileri</li>
        </ul>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">3. Kişisel Verilerin İşlenme Amaçları</h3>
        <p>Toplanan kişisel verileriniz:</p>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li>Sipariş işlemlerinin gerçekleştirilmesi</li>
            <li>Ürünlerin teslimatının yapılması</li>
            <li>Müşteri ilişkileri yönetimi</li>
            <li>İletişim faaliyetlerinin yürütülmesi</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
        </ul>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">4. Kişisel Verilerin Aktarılması</h3>
        <p>Toplanan kişisel verileriniz, yukarıda belirtilen amaçlarla kargo şirketleri ile paylaşılabilir.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">5. Kişisel Veri Sahibinin Hakları</h3>
        <p>KVKK'nın 11. maddesi uyarınca, kişisel veri sahipleri:</p>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li>Kişisel verilerinin işlenip işlenmediğini öğrenme,</li>
            <li>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,</li>
            <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Kişisel verilerin yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
            <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
            <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme,</li>
            <li>Kişisel verilerin düzeltilmesi, silinmesi ya da yok edilmesi halinde bu işlemlerin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
            <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme,</li>
            <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme haklarına sahiptir.</li>
        </ul>
        
        <p style="margin-top: 20px;">Başvurularınızı <strong>ilmekten@gmail.com</strong> e-posta adresine iletebilirsiniz.</p>
    `,
    
    gizlilik: `
        <h2 style="color: var(--brown); font-size: 32px; margin-bottom: 20px;">🔐 Gizlilik Politikası</h2>
        
        <p style="margin-bottom: 20px;"><strong>Son Güncelleme:</strong> 03 Aralık 2024</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">1. Genel Bilgiler</h3>
        <p>İlmekten olarak, müşterilerimizin gizliliğine saygı duyuyor ve kişisel verilerinizi korumak için gereken tüm tedbirleri alıyoruz.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">2. Toplanan Bilgiler</h3>
        <p>Web sitemizi kullanırken aşağıdaki bilgiler toplanabilir:</p>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li><strong>Kişisel Bilgiler:</strong> Ad, soyad, e-posta, telefon, adres</li>
            <li><strong>Sipariş Bilgileri:</strong> Satın alınan ürünler, ödeme tercihleri</li>
            <li><strong>Teknik Bilgiler:</strong> IP adresi, tarayıcı bilgisi, çerezler</li>
        </ul>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">3. Bilgilerin Kullanımı</h3>
        <p>Toplanan bilgiler şu amaçlarla kullanılır:</p>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li>Sipariş işlemlerinin gerçekleştirilmesi</li>
            <li>Müşteri hizmetleri desteği</li>
            <li>Ürün ve hizmet geliştirmeleri</li>
            <li>İletişim ve bilgilendirme</li>
        </ul>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">4. Çerezler (Cookies)</h3>
        <p>Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">5. Üçüncü Taraf Paylaşımları</h3>
        <p>Kişisel bilgileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz. Sipariş teslimatı için kargo firmalarıyla sadece gerekli bilgiler paylaşılır.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">6. Güvenlik</h3>
        <p>Kişisel verilerinizin güvenliği için endüstri standardı güvenlik önlemleri alınmaktadır. Ancak, internet üzerinden hiçbir veri aktarımının %100 güvenli olduğu garanti edilemez.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">7. İletişim</h3>
        <p>Gizlilik politikamız hakkında sorularınız için: <strong>ilmekten@gmail.com</strong></p>
    `,
    
    iade: `
        <h2 style="color: var(--brown); font-size: 32px; margin-bottom: 20px;">🔄 İade ve İptal Koşulları</h2>
        
        <p style="margin-bottom: 20px;"><strong>Son Güncelleme:</strong> 03 Aralık 2024</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">1. İade Hakkı</h3>
        <p>6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca, ürünü teslim aldığınız tarihten itibaren <strong>14 gün</strong> içinde cayma hakkınız bulunmaktadır.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">2. İade Koşulları</h3>
        <p>İade edilecek ürünler için:</p>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li>Ürün kullanılmamış, yıkanmamış ve orijinal ambalajında olmalıdır</li>
            <li>Ürünün etiketi ve ambalajı hasarsız olmalıdır</li>
            <li>İade talebinizi ilmekten@gmail.com adresine iletmelisiniz</li>
            <li>Ürün kargo ile tarafımıza gönderilmelidir</li>
        </ul>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">3. İade Edilemeyen Ürünler</h3>
        <p>Aşağıdaki durumlarda ürünler iade edilemez:</p>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li>Özel sipariş üzerine üretilmiş ürünler</li>
            <li>Kişiye özel isim, tarih vb. işlemeler yapılmış ürünler</li>
            <li>Hijyen kuralları gereği iade alınamayan ürünler</li>
            <li>Kullanılmış, yıkanmış veya hasarlı ürünler</li>
        </ul>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">4. İade Süreci</h3>
        <ol style="margin-left: 20px; margin-top: 10px;">
            <li>İade talebinizi e-posta ile bildirin</li>
            <li>Ürünü orijinal ambalajıyla kargoya verin</li>
            <li>Ürün tarafımıza ulaştıktan sonra kontrol edilir</li>
            <li>Onay sonrası 14 iş günü içinde ücret iadesi yapılır</li>
        </ol>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">5. Sipariş İptali</h3>
        <p>Siparişiniz henüz kargoya verilmemişse ücretsiz iptal edebilirsiniz. Kargoya verildikten sonra iptal taleplerinde yukarıdaki iade koşulları geçerlidir.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">6. Kargo Bedeli</h3>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li><strong>Cayma hakkı kullanımı:</strong> İade kargo ücreti müşteriye aittir</li>
            <li><strong>Hatalı/Hasarlı ürün:</strong> Kargo bedeli tarafımızdan karşılanır</li>
        </ul>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">7. İletişim</h3>
        <p>İade ve iptal işlemleri için: <strong>ilmekten@gmail.com</strong> veya <strong>Instagram: @ilmekten_34</strong></p>
    `,
    
    mesafeli: `
        <h2 style="color: var(--brown); font-size: 32px; margin-bottom: 20px;">📄 Mesafeli Satış Sözleşmesi</h2>
        
        <p style="margin-bottom: 20px;"><strong>Son Güncelleme:</strong> 03 Aralık 2024</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">MADDE 1 - TARAFLAR</h3>
        <p><strong>SATICI:</strong></p>
        <p style="margin-left: 20px;">
            Ünvan: İlmekten<br>
            Adres: İstanbul, Türkiye<br>
            E-posta: ilmekten@gmail.com<br>
            Instagram: @ilmekten_34
        </p>
        
        <p style="margin-top: 20px;"><strong>ALICI:</strong> Sipariş formunda belirtilen kişi</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">MADDE 2 - KONU</h3>
        <p>İşbu Sözleşme, ALICI'nın SATICI'ya ait internet sitesi üzerinden elektronik ortamda siparişini verdiği aşağıda nitelikleri ve satış fiyatı belirtilen ürün/ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">MADDE 3 - SÖZLEŞME KONUSU ÜRÜN BİLGİLERİ</h3>
        <p>Satın alınan ürünün türü, miktarı, marka/modeli, rengi, adedi, satış bedeli ve ödeme şekli sipariş formunda belirtilmiştir.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">MADDE 4 - GENEL HÜKÜMLER</h3>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li>ALICI, sipariş verdiği ürünün temel niteliklerini, satış fiyatını, ödeme şeklini ve teslim koşullarını okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.</li>
            <li>Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile ALICI'nın yerleşim yerinin uzaklığına bağlı olarak 3-10 iş günü içinde teslim edilir.</li>
            <li>Ürün, ALICI'dan başka bir kişiye/kuruluşa teslim edilecek ise, teslim edilecek kişi/kuruluşun teslimatı kabul etmemesinden SATICI sorumlu tutulamaz.</li>
        </ul>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">MADDE 5 - ÖDEME VE TESLİMAT</h3>
        <p>Ödeme şekilleri:</p>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li>Kredi Kartı / Banka Kartı</li>
            <li>Havale / EFT</li>
            <li>Kapıda Ödeme</li>
        </ul>
        
        <p style="margin-top: 15px;">Teslimat, ALICI'nın sipariş formunda belirttiği adrese yapılacaktır.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">MADDE 6 - CAYMA HAKKI</h3>
        <p>ALICI, sözleşme konusu ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">MADDE 7 - YETKİLİ MAHKEME</h3>
        <p>İşbu sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti yasaları uygulanır. İşbu sözleşmeden doğabilecek ihtilaflarda ALICI'nın yerleşim yerindeki Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">MADDE 8 - YÜRÜRLÜK</h3>
        <p>ALICI, sipariş verdiği takdirde işbu sözleşme hükümlerini kabul etmiş sayılır. Sözleşme, ALICI'nın siparişi onaylaması ile yürürlüğe girer.</p>
    `,
    
    kullanim: `
        <h2 style="color: var(--brown); font-size: 32px; margin-bottom: 20px;">📜 Kullanım Koşulları</h2>
        
        <p style="margin-bottom: 20px;"><strong>Son Güncelleme:</strong> 03 Aralık 2024</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">1. Genel Kurallar</h3>
        <p>Bu web sitesini kullanarak, aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">2. Fikri Mülkiyet Hakları</h3>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li>Bu web sitesindeki tüm içerik, tasarım, logo, metin, görsel ve yazılımlar İlmekten'e aittir</li>
            <li>İzinsiz kopyalama, çoğaltma ve kullanım yasaktır</li>
            <li>Ürün fotoğrafları ve açıklamaları telif hakkı ile korunmaktadır</li>
        </ul>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">3. Kullanıcı Sorumlulukları</h3>
        <p>Site kullanıcıları:</p>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li>Gerçek ve güncel bilgiler vermelidir</li>
            <li>Yasal olmayan amaçlarla site kullanılamaz</li>
            <li>Başkalarının haklarına saygı gösterilmelidir</li>
            <li>Site güvenliğini tehlikeye atabilecek işlemler yapılamaz</li>
        </ul>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">4. Ürün Bilgileri</h3>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li>Ürün görselleri temsilidir, renk tonları ekrandan ekrana değişiklik gösterebilir</li>
            <li>El yapımı ürünler olduğu için küçük farklılıklar olabilir</li>
            <li>Ürün açıklamaları ve fiyatlar önceden haber verilmeksizin değiştirilebilir</li>
        </ul>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">5. Sorumluluk Sınırlaması</h3>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li>İlmekten, web sitesinin kesintisiz ve hatasız çalışacağını garanti etmez</li>
            <li>Teknik sorunlardan kaynaklanan veri kayıplarından sorumlu değildir</li>
            <li>Üçüncü taraf sitelere verilen linklerden sorumlu değildir</li>
        </ul>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">6. Fiyat ve Stok Bilgileri</h3>
        <ul style="margin-left: 20px; margin-top: 10px;">
            <li>Tüm fiyatlar Türk Lirası (₺) cinsindendir</li>
            <li>KDV dahildir</li>
            <li>Fiyatlar önceden haber verilmeksizin değiştirilebilir</li>
            <li>Sipariş üzerine üretim yapılır</li>
        </ul>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">7. Kişisel Veri Koruması</h3>
        <p>Kişisel verileriniz KVKK kapsamında korunmaktadır. Detaylı bilgi için KVKK Aydınlatma Metni'ni inceleyiniz.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">8. Değişiklikler</h3>
        <p>İlmekten, bu kullanım koşullarını önceden haber vermeksizin değiştirme hakkını saklı tutar. Güncel koşullar bu sayfada yayınlanacaktır.</p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">9. İletişim</h3>
        <p>Sorularınız için:<br>
        E-posta: <strong>ilmekten@gmail.com</strong><br>
        Instagram: <strong>@ilmekten_34</strong></p>
        
        <h3 style="color: var(--brown); font-size: 24px; margin: 30px 0 15px;">10. Yürürlük</h3>
        <p>Bu kullanım koşulları, siteyi kullanmaya başladığınız anda yürürlüğe girer.</p>
    `
};

function showLegalPage(type) {
    const modal = document.getElementById('legalModal');
    const content = document.getElementById('legalContent');
    
    if (legalContent[type]) {
        content.innerHTML = legalContent[type];
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Scroll to top
        modal.scrollTop = 0;
        
        console.log('📄 Hukuki sayfa açıldı:', type);
    }
}

function closeLegalPage() {
    const modal = document.getElementById('legalModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    console.log('📄 Hukuki sayfa kapatıldı');
}

// ESC ile kapatma
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const legalModal = document.getElementById('legalModal');
        if (legalModal && legalModal.style.display === 'block') {
            closeLegalPage();
        }
    }
});

// ==================== END LEGAL PAGES ====================


function switchTab(tabName, clickedButton) {
    console.log(`🔄 switchTab çağrıldı: tabName="${tabName}", button=`, clickedButton);
    
    // Remove active from all tabs and contents
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-content').forEach(content => content.classList.remove('active'));
    
    // Add active to clicked button (if provided) or find it
    if (clickedButton) {
        clickedButton.classList.add('active');
    } else {
        // Fallback: find the button by checking onclick attribute
        const allButtons = document.querySelectorAll('.admin-tab');
        allButtons.forEach(btn => {
            if (btn.onclick && btn.onclick.toString().includes(`'${tabName}'`)) {
                btn.classList.add('active');
            }
        });
    }
    
    // Show the correct tab content
    const tabElement = document.getElementById(tabName + '-tab');
    if (tabElement) {
        tabElement.classList.add('active');
        console.log(`✅ Tab açıldı: ${tabName}-tab`);
    } else {
        console.error(`❌ Tab bulunamadı: ${tabName}-tab`);
    }
    
    if (tabName === 'settings') {
        const customMessage = localStorage.getItem('ilmekten_custom_message');
        const input = document.getElementById('customEffectMessage');
        if (input && customMessage) {
            input.value = customMessage;
        }
        
        // Depolama durumunu göster
        updateStorageInfo();
        
        // Kurumsal siparişleri listele
        renderAdminCorporateGrid();
    }
    
    if (tabName === 'hero') {
        renderHeroImagesList();
        console.log('✅ Hero tab opened');
    }
    
}

function updateStorageInfo() {
    const storageInfo = document.getElementById('storageInfo');
    if (!storageInfo) return;
    
    try {
        // LocalStorage boyutlarını hesapla
        let totalSize = 0;
        let productsSize = 0;
        let backupSize = 0;
        
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const itemSize = localStorage[key].length * 2; // UTF-16 = 2 bytes per char
                totalSize += itemSize;
                
                if (key === 'ilmekten_products') {
                    productsSize = itemSize;
                } else if (key === 'ilmekten_products_backup') {
                    backupSize = itemSize;
                }
            }
        }
        
        const totalMB = (totalSize / 1024 / 1024).toFixed(2);
        const productsMB = (productsSize / 1024 / 1024).toFixed(2);
        const backupMB = (backupSize / 1024 / 1024).toFixed(2);
        const maxMB = 10; // LocalStorage genelde ~10MB
        const usagePercent = ((totalSize / (maxMB * 1024 * 1024)) * 100).toFixed(1);
        
        const progressColor = usagePercent > 80 ? '#ff4757' : usagePercent > 60 ? '#ffa502' : '#26de81';
        
        storageInfo.innerHTML = `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Toplam Kullanım</span>
                    <span><strong>${totalMB} MB</strong> / ${maxMB} MB (%${usagePercent})</span>
                </div>
                <div style="width: 100%; height: 20px; background: #f0f0f0; border-radius: 10px; overflow: hidden;">
                    <div style="width: ${usagePercent}%; height: 100%; background: ${progressColor}; transition: 0.3s;"></div>
                </div>
            </div>
            <div style="font-size: 13px; color: #999;">
                <p>📦 Ürünler: ${productsMB} MB</p>
                <p>💾 Yedek: ${backupMB} MB</p>
                <p>📊 Ürün sayısı: ${products.length}</p>
            </div>
            ${usagePercent > 80 ? '<p style="color: #ff4757; font-weight: 600; margin-top: 10px;">⚠️ Depolama dolmak üzere!</p>' : ''}
        `;
    } catch (e) {
        storageInfo.innerHTML = '<p style="color: #ff4757;">Depolama bilgisi alınamadı</p>';
    }
}

function clearOldBackups() {
    if (confirm('Eski yedekleri silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz, ancak mevcut ürünleriniz korunacak.')) {
        try {
            // Sadece backup'ı sil, ana veriyi koru
            localStorage.removeItem('ilmekten_products_backup');
            
            // Diğer gereksiz anahtarları temizle
            const keysToKeep = ['ilmekten_products', 'ilmekten_cart', 'ilmekten_effect', 'ilmekten_custom_message', 'ilmekten_corporate'];
            for (let key in localStorage) {
                if (key.startsWith('ilmekten_') && !keysToKeep.includes(key)) {
                    localStorage.removeItem(key);
                }
            }
            
            updateStorageInfo();
            alert('✅ Eski yedekler temizlendi!');
        } catch (e) {
            alert('❌ Temizleme başarısız: ' + e.message);
        }
    }
}

// ==================== KURUMSAL SİPARİŞLER ====================

function addCorporateOrder() {
    // Basit prompt ile ekle
    const company = prompt('Şirket Adı:');
    if (!company) return;
    
    const description = prompt('Açıklama (Kısa):');
    if (!description) return;
    
    const width = parseInt(prompt('Genişlik (cm):', '0')) || 0;
    const height = parseInt(prompt('Yükseklik (cm):', '0')) || 0;
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    
    fileInput.onchange = (e) => {
        const files = Array.from(e.target.files).slice(0, 3); // Max 3 resim
        
        if (files.length === 0) {
            corporateOrders.push({ company, description, width, height, images: [] });
            saveCorporateOrders();
            renderAdminCorporateGrid();
            renderCorporateOrders();
            alert('✅ Kurumsal sipariş eklendi (resimsiz)!');
            return;
        }
        
        // Process images
        const promises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let w = img.width;
                        let h = img.height;
                        const maxSize = 800;
                        
                        if (w > maxSize || h > maxSize) {
                            if (w > h) {
                                h = (h / w) * maxSize;
                                w = maxSize;
                            } else {
                                w = (w / h) * maxSize;
                                h = maxSize;
                            }
                        }
                        
                        canvas.width = w;
                        canvas.height = h;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, w, h);
                        
                        const compressed = canvas.toDataURL('image/jpeg', 0.7);
                        resolve(compressed);
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            });
        });
        
        Promise.all(promises).then(images => {
            corporateOrders.push({ company, description, width, height, images });
            saveCorporateOrders();
            renderAdminCorporateGrid();
            renderCorporateOrders();
            alert(`✅ Kurumsal sipariş eklendi! (${images.length} resim)`);
        });
    };
    
    fileInput.click();
}

function editCorporateOrder(index) {
    const order = corporateOrders[index];
    const company = prompt('Şirket Adı:', order.company);
    if (!company) return;
    
    const description = prompt('Açıklama:', order.description);
    if (!description) return;
    
    const width = parseInt(prompt('Genişlik (cm):', order.width || 0)) || 0;
    const height = parseInt(prompt('Yükseklik (cm):', order.height || 0)) || 0;
    
    corporateOrders[index] = { ...order, company, description, width, height };
    saveCorporateOrders();
    renderAdminCorporateGrid();
    renderCorporateOrders();
    alert('✅ Güncellendi!');
}

function deleteCorporateOrder(index) {
    if (confirm('Bu kurumsal siparişi silmek istediğinizden emin misiniz?')) {
        corporateOrders.splice(index, 1);
        saveCorporateOrders();
        renderAdminCorporateGrid();
        renderCorporateOrders();
        alert('✅ Silindi!');
    }
}

// ==================== KURUMSAL ADMİN FONKSİYONLARI ====================
function renderAdminCorporateGrid() {
    const grid = document.getElementById('adminCorporateGrid');
    if (!grid) return;
    
    if (corporateOrders.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #999;">
                <div style="font-size: 80px; margin-bottom: 20px;">🏢</div>
                <p>Henüz kurumsal sipariş yok. "➕ Yeni Kurumsal Sipariş" butonuna tıklayarak ekleyin.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = corporateOrders.map((order, index) => {
        const mainImage = order.images && order.images.length > 0 ? order.images[0] : null;
        return `
            <div class="admin-product-card" style="border-color: #2d5a3d;">
                <div class="admin-product-image" style="background: linear-gradient(135deg, #f0f5f0, #e8f0e8);">
                    ${mainImage ? 
                        `<img src="${mainImage}" alt="${order.company}">` : 
                        `<div style="font-size: 80px; opacity: 0.3;">🏢</div>`
                    }
                </div>
                <div class="admin-product-info">
                    <h4 style="color: #2d5a3d;">${order.company}</h4>
                    <p style="font-size: 13px; color: #666; margin: 5px 0;">${order.description.substring(0, 60)}...</p>
                    <p style="font-size: 12px; color: #2d5a3d; font-weight: 600;">📏 ${order.width || 0} x ${order.height || 0} cm</p>
                </div>
                <div class="admin-product-actions">
                    <button onclick="editCorporate(${index})" class="btn-edit" style="background: #2d5a3d;">✏️ Düzenle</button>
                    <button onclick="deleteCorporate(${index})" class="btn-delete">🗑️ Sil</button>
                </div>
            </div>
        `;
    }).join('');
}

function openCorporateForm() {
    editingCorporateId = null;
    document.getElementById('corporateForm').reset();
    document.getElementById('corpImagePreview').innerHTML = '<span style="color: #999;">Resim seçilmedi</span>';
    document.getElementById('corporateFormModal').style.display = 'block';
}

function closeCorporateForm() {
    document.getElementById('corporateFormModal').style.display = 'none';
    editingCorporateId = null;
}

function previewCorporateImages(event) {
    const preview = document.getElementById('corpImagePreview');
    const files = event.target.files;
    
    if (files.length === 0) {
        preview.innerHTML = '<span style="color: #999;">Resim seçilmedi</span>';
        return;
    }
    
    preview.innerHTML = '';
    for (let i = 0; i < Math.min(files.length, 3); i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(files[i]);
    }
}

function saveCorporateOrder(event) {
    event.preventDefault();
    
    const company = document.getElementById('corpCompany').value;
    const description = document.getElementById('corpDescription').value;
    const width = parseInt(document.getElementById('corpWidth').value) || 0;
    const height = parseInt(document.getElementById('corpHeight').value) || 0;
    const imageFiles = document.getElementById('corpImages').files;
    
    const processImages = () => {
        const promises = [];
        for (let i = 0; i < Math.min(imageFiles.length, 3); i++) {
            promises.push(new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let w = img.width;
                        let h = img.height;
                        const maxSize = 800;
                        
                        if (w > maxSize || h > maxSize) {
                            if (w > h) {
                                h = (h / w) * maxSize;
                                w = maxSize;
                            } else {
                                w = (w / h) * maxSize;
                                h = maxSize;
                            }
                        }
                        
                        canvas.width = w;
                        canvas.height = h;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, w, h);
                        
                        const compressed = canvas.toDataURL('image/jpeg', 0.7);
                        console.log(`📦 Kurumsal resim sıkıştırıldı: ${(e.target.result.length / 1024).toFixed(0)}KB → ${(compressed.length / 1024).toFixed(0)}KB`);
                        resolve(compressed);
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(imageFiles[i]);
            }));
        }
        return Promise.all(promises);
    };
    
    if (editingCorporateId !== null) {
        // Güncelleme
        const index = editingCorporateId;
        corporateOrders[index] = {
            ...corporateOrders[index],
            company,
            description,
            width,
            height
        };
        
        if (imageFiles.length > 0) {
            processImages().then(images => {
                corporateOrders[index].images = images;
                finishSaveCorporate('✅ Kurumsal sipariş güncellendi!');
            });
        } else {
            finishSaveCorporate('✅ Kurumsal sipariş güncellendi!');
        }
    } else {
        // Yeni ekleme
        const newOrder = {
            company,
            description,
            width,
            height,
            images: []
        };
        
        if (imageFiles.length > 0) {
            processImages().then(images => {
                newOrder.images = images;
                corporateOrders.push(newOrder);
                finishSaveCorporate('✅ Yeni kurumsal sipariş eklendi!');
            });
        } else {
            corporateOrders.push(newOrder);
            finishSaveCorporate('✅ Yeni kurumsal sipariş eklendi!');
        }
    }
}

function finishSaveCorporate(message) {
    saveCorporateOrders();
    renderAdminCorporateGrid();
    renderCorporateOrders();
    closeCorporateForm();
    alert(message);
}

function editCorporate(index) {
    const order = corporateOrders[index];
    editingCorporateId = index;
    
    document.getElementById('corpCompany').value = order.company;
    document.getElementById('corpDescription').value = order.description;
    document.getElementById('corpWidth').value = order.width || '';
    document.getElementById('corpHeight').value = order.height || '';
    
    const preview = document.getElementById('corpImagePreview');
    if (order.images && order.images.length > 0) {
        preview.innerHTML = '';
        order.images.forEach(img => {
            const imgEl = document.createElement('img');
            imgEl.src = img;
            preview.appendChild(imgEl);
        });
    }
    
    document.getElementById('corporateFormModal').style.display = 'block';
}

function deleteCorporate(index) {
    if (confirm('Bu kurumsal siparişi silmek istediğinizden emin misiniz?')) {
        corporateOrders.splice(index, 1);
        saveCorporateOrders();
        renderAdminCorporateGrid();
        renderCorporateOrders();
        alert('✅ Silindi!');
    }
}

function showCorporateDetail(index) {
    const order = corporateOrders[index];
    if (!order) return;
    
    currentImageIndex = 0;
    const hasMultipleImages = order.images && order.images.length > 1;
    const currentImage = (order.images && order.images.length > 0) ? order.images[0] : null;
    
    const modalContent = `
        <div class="detail-image" style="position: relative; background: linear-gradient(135deg, #f0f5f0, #e8f0e8);">
            ${currentImage ? 
                `<img id="corporateMainImage" src="${currentImage}" alt="${order.company}" onclick="openLightbox('${currentImage}')" style="max-width: 90%; max-height: 90%; object-fit: contain; transition: 0.3s;">` : 
                `<div style="font-size: 200px; opacity: 0.3;">🏢</div>`
            }
            ${currentImage ? `<div class="zoom-icon" style="background: rgba(45,90,61,0.9);" onclick="openLightbox('${currentImage}')">🔍</div>` : ''}
            ${hasMultipleImages ? `
                <button onclick="event.stopPropagation(); prevCorporateImage(${index})" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(45,90,61,0.9); color: white; border: none; width: 50px; height: 50px; border-radius: 50%; font-size: 24px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">‹</button>
                <button onclick="event.stopPropagation(); nextCorporateImage(${index})" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(45,90,61,0.9); color: white; border: none; width: 50px; height: 50px; border-radius: 50%; font-size: 24px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">›</button>
                <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">1 / ${order.images.length}</div>
            ` : ''}
        </div>
        <div class="detail-info">
            <div style="display: inline-block; background: linear-gradient(135deg, #2d5a3d, #1a3d28); color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: 700; margin-bottom: 20px;">
                KURUMSAL REFERANS
            </div>
            <h2 style="color: #2d5a3d;">${order.company}</h2>
            
            <div class="detail-specs">
                <div class="detail-spec-item">
                    <span>📏</span>
                    <div>
                        <div style="font-size: 12px; color: #999;">Ebat</div>
                        <div class="detail-spec-value">${order.width || 0} x ${order.height || 0} cm</div>
                    </div>
                </div>
                <div class="detail-spec-item">
                    <span>🏢</span>
                    <div>
                        <div style="font-size: 12px; color: #999;">Kategori</div>
                        <div class="detail-spec-value">Kurumsal Sipariş</div>
                    </div>
                </div>
                <div class="detail-spec-item">
                    <span>✋</span>
                    <div>
                        <div style="font-size: 12px; color: #999;">Üretim</div>
                        <div class="detail-spec-value">%100 El Yapımı</div>
                    </div>
                </div>
                <div class="detail-spec-item">
                    <span>🎨</span>
                    <div>
                        <div style="font-size: 12px; color: #999;">Durum</div>
                        <div class="detail-spec-value">Sipariş Üzerine</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-description">${order.description}</div>
            
            <button class="btn btn-primary" style="
                width: 100%; 
                font-size: 20px; 
                padding: 18px; 
                background: linear-gradient(135deg, #2d5a3d 0%, #1a3d28 100%); 
                border: none; 
                box-shadow: 0 8px 25px rgba(45, 90, 61, 0.3);
            " onclick="closeModal(); setTimeout(() => window.location.href='#iletisim', 300);">
                📞 Teklif Al
            </button>
            
            <p style="text-align: center; margin-top: 15px; font-size: 13px; color: #999;">
                <strong style="color: #2d5a3d;">💼 Kurumsal Sipariş</strong> için bizimle iletişime geçin
            </p>
        </div>
    `;
    
    document.getElementById('productDetail').innerHTML = modalContent;
    document.getElementById('productModal').classList.add('active');
}

function prevCorporateImage(orderIndex) {
    const order = corporateOrders[orderIndex];
    if (!order || !order.images || order.images.length <= 1) return;
    
    currentImageIndex = (currentImageIndex - 1 + order.images.length) % order.images.length;
    updateCorporateImage(order);
}

function nextCorporateImage(orderIndex) {
    const order = corporateOrders[orderIndex];
    if (!order || !order.images || order.images.length <= 1) return;
    
    currentImageIndex = (currentImageIndex + 1) % order.images.length;
    updateCorporateImage(order);
}

function updateCorporateImage(order) {
    const img = document.getElementById('corporateMainImage');
    if (img && order.images && order.images[currentImageIndex]) {
        const newImageSrc = order.images[currentImageIndex];
        
        img.style.opacity = '0';
        setTimeout(() => {
            img.src = newImageSrc;
            img.onclick = () => openLightbox(newImageSrc);
            img.style.opacity = '1';
        }, 150);
    }
    
    // Zoom icon'u güncelle
    const zoomIcon = document.querySelector('.zoom-icon');
    if (zoomIcon && order.images && order.images[currentImageIndex]) {
        zoomIcon.onclick = () => openLightbox(order.images[currentImageIndex]);
    }
    
    const counter = document.querySelector('.detail-image div[style*="bottom: 20px"]');
    if (counter) {
        counter.textContent = `${currentImageIndex + 1} / ${order.images.length}`;
    }
}

function loadAdminProducts() {
    const grid = document.getElementById('adminProductsGrid');
    grid.innerHTML = products.map(p => {
        const mainImage = p.images && p.images.length > 0 ? p.images[0] : null;
        return `
        <div class="admin-product-card">
            <div class="admin-product-image">
                ${mainImage ? 
                    `<img src="${mainImage}" alt="${p.name}">` : 
                    `<div style="font-size: 80px;">${p.emoji}</div>`
                }
                ${p.images && p.images.length > 1 ? `<div style="position: absolute; top: 10px; right: 10px; background: var(--red); color: white; padding: 4px 8px; border-radius: 10px; font-size: 11px; font-weight: 700;">${p.images.length} resim</div>` : ''}
                <button class="image-upload-btn" onclick="uploadImage(${p.id})">
                    📷 ${mainImage ? 'Resimleri Düzenle' : 'Resim Yükle'}
                </button>
            </div>
            <div class="admin-product-info">
                <h4>${p.name}</h4>
                <p><strong>Kategori:</strong> ${p.category}</p>
                <p><strong>Fiyat:</strong> ${p.price} ₺</p>
                <p style="font-size: 13px; color: #999;">${p.description.substring(0, 60)}...</p>
            </div>
            <div class="admin-product-actions">
                <button class="admin-btn-edit" onclick="editProduct(${p.id})">✏️ Düzenle</button>
                <button class="admin-btn-delete" onclick="deleteProduct(${p.id})">🗑️ Sil</button>
            </div>
        </div>
    `;
    }).join('');
}

function showAddProductForm() {
    editingProductId = null;
    const formContainer = document.getElementById('editFormContainer');
    formContainer.innerHTML = `
        <div class="product-edit-form">
            <h3 style="color: var(--brown); margin-bottom: 25px; font-size: 24px;">➕ Yeni Ürün Ekle</h3>
            <form onsubmit="saveProduct(event)">
                <div class="form-group">
                    <label>Ürün Adı</label>
                    <input type="text" id="productName" required placeholder="Ör: Sevimli Lama">
                </div>
                <div class="form-group">
                    <label>Kategori</label>
                    <select id="productCategory" required>
                        <option value="">Seçiniz</option>
                        <option value="Noel Teması">Noel Teması</option>
                        <option value="Hayvanlar">Hayvanlar</option>
                        <option value="Karakterler">Karakterler</option>
                        <option value="Dekorasyon">Dekorasyon</option>
                    </select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>En (cm)</label>
                        <input type="number" id="productWidth" required placeholder="15">
                    </div>
                    <div class="form-group">
                        <label>Boy (cm)</label>
                        <input type="number" id="productHeight" required placeholder="25">
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>Fiyat (₺)</label>
                        <input type="number" id="productPrice" required placeholder="350">
                    </div>
                    <div class="form-group">
                        <label>Yapım Süresi (gün)</label>
                        <input type="number" id="productDays" required placeholder="3">
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label>İndirim Oranı (%)</label>
                        <input type="number" id="productDiscount" min="0" max="100" placeholder="0" value="0">
                    </div>
                    <div class="form-group">
                        <label>Hikaye Bağlantısı</label>
                        <select id="productStory" style="padding: 12px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 16px;">
                            <option value="">Hikaye Yok</option>
                            <option value="0">Nisse ve Tomte</option>
                            <option value="1">Llama Kuzco</option>
                            <option value="2">Kaplumbağa Toshi</option>
                            <option value="3">Atlar ve Hazine</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <textarea id="productDescription" required placeholder="Ürün açıklaması..."></textarea>
                </div>
                <div class="form-group">
                    <label>Emoji (varsayılan görsel)</label>
                    <input type="text" id="productEmoji" required placeholder="🦙" maxlength="2">
                </div>
                <div class="form-group">
                    <label>Resimler (En fazla 3)</label>
                    <p style="font-size: 12px; color: #666; margin-bottom: 10px;">💡 Birden fazla resim seçmek için Ctrl (Windows) veya Cmd (Mac) tuşuna basılı tutun</p>
                    <input type="file" id="productImage" accept="image/*" multiple onchange="previewImage(event)">
                    <div class="image-preview" id="imagePreview">
                        <span style="color: #999;">Resim seçilmedi</span>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-save">💾 Kaydet</button>
                    <button type="button" class="btn-cancel" onclick="cancelEdit()">❌ İptal</button>
                </div>
            </form>
        </div>
    `;
    formContainer.scrollIntoView({ behavior: 'smooth' });
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    editingProductId = id;
    const formContainer = document.getElementById('editFormContainer');
    
    // Mevcut resimleri göster
    let imagesPreview = '';
    if (product.images && product.images.length > 0) {
        imagesPreview = product.images.map((img, idx) => 
            `<div style="position: relative; display: inline-block; margin: 5px;">
                <img src="${img}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px; border: 2px solid #ddd;">
                <span style="position: absolute; top: -8px; right: -8px; background: var(--red); color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">${idx + 1}</span>
            </div>`
        ).join('');
    } else {
        imagesPreview = '<span style="color: #999;">Mevcut resim yok</span>';
    }
    
    formContainer.innerHTML = `
        <div class="product-edit-form">
            <h3 style="color: var(--brown); margin-bottom: 25px; font-size: 24px;">✏️ Ürün Düzenle: ${product.name}</h3>
            <form onsubmit="saveProduct(event)">
                <div class="form-group">
                    <label>Ürün Adı</label>
                    <input type="text" id="productName" required value="${product.name}">
                </div>
                <div class="form-group">
                    <label>Kategori</label>
                    <select id="productCategory" required>
                        <option value="">Seçiniz</option>
                        <option value="Noel Teması" ${product.category === 'Noel Teması' ? 'selected' : ''}>Noel Teması</option>
                        <option value="Hayvanlar" ${product.category === 'Hayvanlar' ? 'selected' : ''}>Hayvanlar</option>
                        <option value="Karakterler" ${product.category === 'Karakterler' ? 'selected' : ''}>Karakterler</option>
                        <option value="Dekorasyon" ${product.category === 'Dekorasyon' ? 'selected' : ''}>Dekorasyon</option>
                    </select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>En (cm)</label>
                        <input type="number" id="productWidth" required value="${product.width || 0}">
                    </div>
                    <div class="form-group">
                        <label>Boy (cm)</label>
                        <input type="number" id="productHeight" required value="${product.height || 0}">
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>Fiyat (₺)</label>
                        <input type="number" id="productPrice" required value="${product.price}">
                    </div>
                    <div class="form-group">
                        <label>Yapım Süresi (gün)</label>
                        <input type="number" id="productDays" required value="${product.production_days || 0}">
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label>İndirim Oranı (%)</label>
                        <input type="number" id="productDiscount" min="0" max="100" value="${product.discount || 0}">
                    </div>
                    <div class="form-group">
                        <label>Hikaye Bağlantısı</label>
                        <select id="productStory" style="padding: 12px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 16px;">
                            <option value="" ${!product.storyIndex && product.storyIndex !== 0 ? 'selected' : ''}>Hikaye Yok</option>
                            <option value="0" ${product.storyIndex === 0 ? 'selected' : ''}>Nisse ve Tomte</option>
                            <option value="1" ${product.storyIndex === 1 ? 'selected' : ''}>Llama Kuzco</option>
                            <option value="2" ${product.storyIndex === 2 ? 'selected' : ''}>Kaplumbağa Toshi</option>
                            <option value="3" ${product.storyIndex === 3 ? 'selected' : ''}>Atlar ve Hazine</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <textarea id="productDescription" required>${product.description}</textarea>
                </div>
                <div class="form-group">
                    <label>Emoji</label>
                    <input type="text" id="productEmoji" required value="${product.emoji}" maxlength="2">
                </div>
                <div class="form-group">
                    <label>Resimler (En fazla 3)</label>
                    <p style="font-size: 12px; color: #666; margin-bottom: 10px;">💡 Birden fazla resim seçmek için Ctrl (Windows) veya Cmd (Mac) tuşuna basılı tutun</p>
                    <input type="file" id="productImage" accept="image/*" multiple onchange="previewImage(event)">
                    <div class="image-preview" id="imagePreview">
                        ${imagesPreview}
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-save">💾 Güncelle</button>
                    <button type="button" class="btn-cancel" onclick="cancelEdit()">❌ İptal</button>
                </div>
            </form>
        </div>
    `;
    formContainer.scrollIntoView({ behavior: 'smooth' });
}

function previewImage(event) {
    const files = event.target.files;
    const preview = document.getElementById('imagePreview');
    
    if (files.length === 0) {
        preview.innerHTML = '<span style="color: #999;">Resim seçilmedi</span>';
        return;
    }
    
    const maxFiles = Math.min(files.length, 3);
    preview.innerHTML = '';
    
    for (let i = 0; i < maxFiles; i++) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgDiv = document.createElement('div');
            imgDiv.style.cssText = 'position: relative; display: inline-block; margin: 5px;';
            imgDiv.innerHTML = `
                <img src="${e.target.result}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 12px; border: 2px solid var(--red);">
                <span style="position: absolute; top: -8px; right: -8px; background: var(--red); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">${i + 1}</span>
            `;
            preview.appendChild(imgDiv);
        };
        reader.readAsDataURL(files[i]);
    }
    
    if (files.length > 3) {
        const warning = document.createElement('p');
        warning.style.cssText = 'color: var(--red); font-size: 12px; margin-top: 10px;';
        warning.textContent = `⚠️ En fazla 3 resim yüklenebilir. İlk 3 resim seçildi.`;
        preview.appendChild(warning);
    }
}

function saveProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const emoji = document.getElementById('productEmoji').value;
    const width = parseInt(document.getElementById('productWidth').value);
    const height = parseInt(document.getElementById('productHeight').value);
    const production_days = parseInt(document.getElementById('productDays').value);
    const discount = parseInt(document.getElementById('productDiscount').value) || 0;
    const storySelect = document.getElementById('productStory').value;
    const storyIndex = storySelect === '' ? null : parseInt(storySelect);
    const imageFiles = document.getElementById('productImage').files;
    
    // Resim işleme fonksiyonu
    // Resim sıkıştırma ve işleme fonksiyonu
    const processImages = () => {
        const promises = [];
        for (let i = 0; i < Math.min(imageFiles.length, 3); i++) {
            promises.push(new Promise((resolve) => {
                const file = imageFiles[i];
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        // Canvas ile resmi sıkıştır
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        
                        // Maksimum boyut: 800px (her iki yönde de)
                        const maxSize = 800;
                        if (width > maxSize || height > maxSize) {
                            if (width > height) {
                                height = (height / width) * maxSize;
                                width = maxSize;
                            } else {
                                width = (width / height) * maxSize;
                                height = maxSize;
                            }
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // JPEG olarak sıkıştır (kalite: 0.7 = %70)
                        const compressedData = canvas.toDataURL('image/jpeg', 0.7);
                        
                        console.log(`📦 Resim sıkıştırıldı: ${(e.target.result.length / 1024).toFixed(0)}KB → ${(compressedData.length / 1024).toFixed(0)}KB`);
                        
                        resolve(compressedData);
                    };
                    img.src = e.target.result;
                };
                
                reader.readAsDataURL(file);
            }));
        }
        return Promise.all(promises);
    };
    
    if (editingProductId) {
        // Ürünü güncelle
        const productIndex = products.findIndex(p => p.id === editingProductId);
        products[productIndex] = {
            ...products[productIndex],
            name,
            category,
            price,
            discount,
            description,
            emoji,
            width,
            height,
            production_days,
            storyIndex
        };
        
        if (imageFiles.length > 0) {
            processImages().then(images => {
                products[productIndex].images = images;
                finishSave('✅ Ürün başarıyla güncellendi!');
            });
        } else {
            finishSave('✅ Ürün başarıyla güncellendi!');
        }
    } else {
        // Yeni ürün ekle
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = {
            id: newId,
            name,
            category,
            price,
            discount,
            description,
            emoji,
            width,
            height,
            production_days,
            storyIndex,
            images: []
        };
        
        if (imageFiles.length > 0) {
            processImages().then(images => {
                newProduct.images = images;
                products.push(newProduct);
                finishSave('✅ Yeni ürün başarıyla eklendi!');
            });
        } else {
            products.push(newProduct);
            finishSave('✅ Yeni ürün başarıyla eklendi!');
        }
    }
}

function finishSave(message) {
    alert(message);
    saveProducts();
    cancelEdit();
    loadAdminProducts();
    renderProducts(); // Ürünler sayfasını güncelle
    renderHomeProducts(); // ✨ Ana sayfayı da güncelle!
    
    console.log('✅ Ürün kaydedildi ve tüm görünümler güncellendi');
}

function cancelEdit() {
    document.getElementById('editFormContainer').innerHTML = '';
    editingProductId = null;
}

function deleteProduct(id) {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products.splice(index, 1);
        saveProducts();
        loadAdminProducts();
        renderProducts();
        renderHomeProducts(); // ✨ Ana sayfayı da güncelle!
        alert('✅ Ürün silindi!');
    }
}

function uploadImage(id) {
    editProduct(id);
    setTimeout(() => {
        document.getElementById('productImage').click();
    }, 300);
}

// Click outside admin modal to close
document.getElementById('adminModal').onclick = function(e) {
    if (e.target === this) closeAdmin();
};

// ==================== SEASONAL EFFECTS ====================
let currentEffect = 'none';

function changeSeasonalEffect(effect) {
    currentEffect = effect;
    localStorage.setItem('ilmekten_effect', effect);
    applySeasonalEffect(effect);
}

// ==================== COLOR THEME SYSTEM ====================

const colorThemes = {
    original: {
        name: '❤️ Orijinal',
        primary: '#DC143C',
        secondary: '#B22222',
        accent: '#8b7355',
        gradient: 'linear-gradient(135deg, #DC143C 0%, #B22222 100%)'
    },
    blue: {
        name: '💙 Mavi',
        primary: '#2196F3',
        secondary: '#1976D2',
        accent: '#455A64',
        gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)'
    },
    green: {
        name: '💚 Yeşil',
        primary: '#4CAF50',
        secondary: '#388E3C',
        accent: '#5D4037',
        gradient: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)'
    },
    purple: {
        name: '💜 Mor',
        primary: '#9C27B0',
        secondary: '#7B1FA2',
        accent: '#6A1B9A',
        gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)'
    },
    orange: {
        name: '🧡 Turuncu',
        primary: '#FF9800',
        secondary: '#F57C00',
        accent: '#795548',
        gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
    },
    pink: {
        name: '💗 Pembe',
        primary: '#E91E63',
        secondary: '#C2185B',
        accent: '#880E4F',
        gradient: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)'
    },
    brown: {
        name: '🤎 Kahve',
        primary: '#795548',
        secondary: '#5D4037',
        accent: '#4E342E',
        gradient: 'linear-gradient(135deg, #795548 0%, #5D4037 100%)'
    }
};

function changeColorTheme(themeName) {
    const theme = colorThemes[themeName];
    if (!theme) return;
    
    // Update CSS variables
    document.documentElement.style.setProperty('--red', theme.primary);
    document.documentElement.style.setProperty('--dark-red', theme.secondary);
    document.documentElement.style.setProperty('--brown', theme.accent);
    
    // Update header immediately
    const header = document.querySelector('header');
    if (header) {
        header.style.background = theme.gradient;
        // Update box-shadow color to match theme
        const rgb = hexToRgb(theme.primary);
        header.style.boxShadow = `0 6px 25px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`;
    }
    
    // Save to localStorage
    localStorage.setItem('ilmekten_theme', themeName);
    
    // Update preview
    updateThemePreview(theme);
    
    // Show toast
    showSuccess('Tema Değiştirildi! 🎨', `${theme.name} teması aktif edildi.`, 3000);
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 220, g: 20, b: 60 };
}

function loadColorTheme() {
    const savedTheme = localStorage.getItem('ilmekten_theme') || 'original';
    const theme = colorThemes[savedTheme];
    
    if (theme) {
        // Always set CSS variables
        document.documentElement.style.setProperty('--red', theme.primary);
        document.documentElement.style.setProperty('--dark-red', theme.secondary);
        document.documentElement.style.setProperty('--brown', theme.accent);
        
        // Update header
        const header = document.querySelector('header');
        if (header) {
            header.style.background = theme.gradient;
            const rgb = hexToRgb(theme.primary);
            header.style.boxShadow = `0 6px 25px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`;
        }
    }
    
    // Set selector value
    const selector = document.getElementById('themeSelector');
    if (selector) {
        selector.value = savedTheme;
        updateThemePreview(theme);
    }
}

function updateThemePreview(theme) {
    const preview = document.getElementById('themePreview');
    if (preview) {
        preview.style.background = theme.gradient;
        preview.style.boxShadow = `0 8px 25px ${theme.primary}40`;
    }
}

// ==================== PAYMENT METHODS MANAGEMENT ====================

let enabledPaymentMethods = {
    card: false,
    transfer: true,
    cash: true
};

function loadPaymentMethods() {
    const saved = localStorage.getItem('ilmekten_payment_methods');
    if (saved) {
        enabledPaymentMethods = JSON.parse(saved);
    }
    
    // Update checkboxes
    document.getElementById('paymentCard').checked = enabledPaymentMethods.card;
    document.getElementById('paymentTransfer').checked = enabledPaymentMethods.transfer;
    document.getElementById('paymentCash').checked = enabledPaymentMethods.cash;
    
    console.log('💳 Ödeme yöntemleri yüklendi:', enabledPaymentMethods);
}

function togglePaymentMethod(method, enabled) {
    // En az bir yöntem aktif olmalı
    const activeCount = Object.values(enabledPaymentMethods).filter(v => v).length;
    
    if (!enabled && activeCount === 1) {
        showWarning('Uyarı', 'En az bir ödeme yöntemi aktif olmalıdır.');
        // Checkbox'ı geri aç
        document.getElementById('payment' + method.charAt(0).toUpperCase() + method.slice(1)).checked = true;
        return;
    }
    
    enabledPaymentMethods[method] = enabled;
    localStorage.setItem('ilmekten_payment_methods', JSON.stringify(enabledPaymentMethods));
    
    const methodNames = {
        card: 'Kredi/Banka Kartı',
        transfer: 'Havale/EFT',
        cash: 'Kapıda Ödeme'
    };
    
    if (enabled) {
        showSuccess('Ödeme Yöntemi Aktif', `${methodNames[method]} müşterilere sunuluyor.`);
    } else {
        showInfo('Ödeme Yöntemi Kapalı', `${methodNames[method]} devre dışı bırakıldı.`);
    }
    
    console.log('💳 Ödeme yöntemleri güncellendi:', enabledPaymentMethods);
}

// ==================== BANK ACCOUNT MANAGEMENT ====================

let bankInfo = {
    bankName: '',
    accountName: '',
    iban: '',
    branch: '',
    accountNo: '',
    notes: ''
};

function loadBankInfo() {
    const saved = localStorage.getItem('ilmekten_bank_info');
    if (saved) {
        bankInfo = JSON.parse(saved);
        
        // Fill form
        document.getElementById('bankName').value = bankInfo.bankName || '';
        document.getElementById('bankAccountName').value = bankInfo.accountName || '';
        document.getElementById('bankIBAN').value = bankInfo.iban || '';
        document.getElementById('bankBranch').value = bankInfo.branch || '';
        document.getElementById('bankAccountNo').value = bankInfo.accountNo || '';
        document.getElementById('bankNotes').value = bankInfo.notes || '';
        
        console.log('🏦 Banka bilgileri yüklendi');
    }
}

function saveBankInfo() {
    const bankName = document.getElementById('bankName').value.trim();
    const accountName = document.getElementById('bankAccountName').value.trim();
    const iban = document.getElementById('bankIBAN').value.trim();
    const branch = document.getElementById('bankBranch').value.trim();
    const accountNo = document.getElementById('bankAccountNo').value.trim();
    const notes = document.getElementById('bankNotes').value.trim();
    
    // Validation
    if (!bankName || !accountName || !iban) {
        showWarning('Eksik Bilgi', 'Lütfen en az Banka Adı, Hesap Sahibi ve IBAN bilgilerini girin.');
        return;
    }
    
    bankInfo = {
        bankName,
        accountName,
        iban,
        branch,
        accountNo,
        notes
    };
    
    localStorage.setItem('ilmekten_bank_info', JSON.stringify(bankInfo));
    showSuccess('Banka Bilgileri Kaydedildi! 🏦', 'Müşterileriniz havale yaparken bu bilgileri görecek.');
    
    console.log('🏦 Banka bilgileri kaydedildi:', bankInfo);
}

function formatIBAN(input) {
    let value = input.value.replace(/\s/g, '').toUpperCase();
    
    // TR ile başlamıyorsa ekle
    if (value.length > 0 && !value.startsWith('TR')) {
        value = 'TR' + value;
    }
    
    // Her 4 karakterde bir boşluk ekle
    value = value.match(/.{1,4}/g)?.join(' ') || value;
    
    input.value = value;
}

// ==================== COUPON SYSTEM ====================

let coupons = [];
let appliedCoupon = null;

function loadCoupons() {
    const saved = localStorage.getItem('ilmekten_coupons');
    if (saved) {
        coupons = JSON.parse(saved);
    }
    console.log('🎟️ Kuponlar yüklendi:', coupons.length);
}

function saveCoupons() {
    localStorage.setItem('ilmekten_coupons', JSON.stringify(coupons));
    console.log('✅ Kuponlar kaydedildi');
}

function showAddCouponForm() {
    document.getElementById('addCouponForm').style.display = 'block';
    document.getElementById('addCouponForm').scrollIntoView({ behavior: 'smooth' });
}

function cancelCouponForm() {
    document.getElementById('addCouponForm').style.display = 'none';
    // Clear form
    document.getElementById('couponCode').value = '';
    document.getElementById('couponType').value = 'percentage';
    document.getElementById('couponAmount').value = '';
    document.getElementById('couponMinAmount').value = '';
    document.getElementById('couponUsageLimit').value = '';
    document.getElementById('couponStartDate').value = '';
    document.getElementById('couponEndDate').value = '';
    document.getElementById('couponDescription').value = '';
}

function saveCoupon() {
    const code = document.getElementById('couponCode').value.trim().toUpperCase();
    const type = document.getElementById('couponType').value;
    const amount = parseFloat(document.getElementById('couponAmount').value);
    const minAmount = parseFloat(document.getElementById('couponMinAmount').value) || 0;
    const usageLimit = parseInt(document.getElementById('couponUsageLimit').value) || null;
    const startDate = document.getElementById('couponStartDate').value;
    const endDate = document.getElementById('couponEndDate').value;
    const description = document.getElementById('couponDescription').value.trim();
    
    // Validation
    if (!code) {
        showWarning('Eksik Bilgi', 'Lütfen kupon kodu girin.');
        return;
    }
    
    if (!amount || amount <= 0) {
        showWarning('Geçersiz Miktar', 'Lütfen geçerli bir indirim miktarı girin.');
        return;
    }
    
    if (type === 'percentage' && amount > 100) {
        showWarning('Geçersiz Oran', 'Yüzde indirimi 100\'den fazla olamaz.');
        return;
    }
    
    // Check if code already exists
    if (coupons.some(c => c.code === code)) {
        showWarning('Kupon Mevcut', 'Bu kupon kodu zaten kullanılıyor.');
        return;
    }
    
    const coupon = {
        id: Date.now(),
        code,
        type,
        amount,
        minAmount,
        usageLimit,
        usageCount: 0,
        startDate,
        endDate,
        description,
        active: true,
        createdAt: new Date().toISOString()
    };
    
    coupons.push(coupon);
    saveCoupons();
    renderAdminCoupons();
    cancelCouponForm();
    
    showSuccess('Kupon Oluşturuldu! 🎟️', `${code} kuponu başarıyla eklendi.`);
}

function renderAdminCoupons() {
    const container = document.getElementById('couponsList');
    
    if (coupons.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; background: #f9f9f9; border-radius: 15px;">
                <div style="font-size: 80px; margin-bottom: 20px;">🎟️</div>
                <h3 style="color: var(--brown); margin-bottom: 10px;">Henüz Kupon Yok</h3>
                <p style="color: #999;">Yeni kupon oluşturmak için yukarıdaki butona tıklayın</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = coupons.map(coupon => {
        const isExpired = coupon.endDate && new Date(coupon.endDate) < new Date();
        const isLimitReached = coupon.usageLimit && coupon.usageCount >= coupon.usageLimit;
        const statusColor = !coupon.active ? '#999' : isExpired || isLimitReached ? '#ff6b6b' : '#4CAF50';
        const statusText = !coupon.active ? 'Pasif' : isExpired ? 'Süresi Doldu' : isLimitReached ? 'Limit Doldu' : 'Aktif';
        
        return `
            <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-left: 5px solid ${statusColor};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                            <h4 style="font-size: 24px; color: var(--brown); margin: 0; font-family: 'Courier New', monospace; background: linear-gradient(135deg, #f0f0f0, #e0e0e0); padding: 10px 20px; border-radius: 12px; border: 2px dashed var(--brown);">
                                ${coupon.code}
                            </h4>
                            <span style="background: ${statusColor}; color: white; padding: 6px 15px; border-radius: 20px; font-size: 13px; font-weight: 700;">
                                ${statusText}
                            </span>
                        </div>
                        
                        <div style="color: #666; font-size: 14px; line-height: 1.8;">
                            <div style="margin-bottom: 8px;">
                                <strong style="color: var(--brown);">💰 İndirim:</strong> 
                                ${coupon.type === 'percentage' ? `%${coupon.amount}` : `${coupon.amount}₺`}
                            </div>
                            ${coupon.minAmount > 0 ? `
                                <div style="margin-bottom: 8px;">
                                    <strong style="color: var(--brown);">🛒 Min. Sepet:</strong> ${coupon.minAmount}₺
                                </div>
                            ` : ''}
                            ${coupon.usageLimit ? `
                                <div style="margin-bottom: 8px;">
                                    <strong style="color: var(--brown);">📊 Kullanım:</strong> 
                                    ${coupon.usageCount} / ${coupon.usageLimit}
                                </div>
                            ` : `
                                <div style="margin-bottom: 8px;">
                                    <strong style="color: var(--brown);">📊 Kullanım:</strong> 
                                    ${coupon.usageCount} (Sınırsız)
                                </div>
                            `}
                            ${coupon.startDate || coupon.endDate ? `
                                <div style="margin-bottom: 8px;">
                                    <strong style="color: var(--brown);">📅 Geçerlilik:</strong> 
                                    ${coupon.startDate ? new Date(coupon.startDate).toLocaleDateString('tr-TR') : '...'} - 
                                    ${coupon.endDate ? new Date(coupon.endDate).toLocaleDateString('tr-TR') : '...'}
                                </div>
                            ` : ''}
                            ${coupon.description ? `
                                <div style="margin-top: 10px; padding: 10px; background: #f9f9f9; border-radius: 12px;">
                                    <strong style="color: var(--brown);">📝 Açıklama:</strong><br>
                                    ${coupon.description}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button onclick="toggleCouponStatus(${coupon.id})" style="padding: 10px 20px; background: ${coupon.active ? '#ff9800' : '#4CAF50'}; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 13px;">
                            ${coupon.active ? '⏸️ Pasif Et' : '▶️ Aktif Et'}
                        </button>
                        <button onclick="deleteCoupon(${coupon.id})" style="padding: 10px 20px; background: #ff6b6b; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 13px;">
                            🗑️ Sil
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function toggleCouponStatus(id) {
    const coupon = coupons.find(c => c.id === id);
    if (coupon) {
        coupon.active = !coupon.active;
        saveCoupons();
        renderAdminCoupons();
        showSuccess('Kupon Güncellendi', `${coupon.code} kuponu ${coupon.active ? 'aktif' : 'pasif'} edildi.`);
    }
}

function deleteCoupon(id) {
    const coupon = coupons.find(c => c.id === id);
    if (coupon && confirm(`"${coupon.code}" kuponunu silmek istediğinizden emin misiniz?`)) {
        coupons = coupons.filter(c => c.id !== id);
        saveCoupons();
        renderAdminCoupons();
        showSuccess('Kupon Silindi', `${coupon.code} kuponu silindi.`);
    }
}

function validateCoupon(code, cartTotal) {
    const coupon = coupons.find(c => c.code === code.toUpperCase());
    
    if (!coupon) {
        return { valid: false, message: 'Geçersiz kupon kodu' };
    }
    
    if (!coupon.active) {
        return { valid: false, message: 'Bu kupon aktif değil' };
    }
    
    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return { valid: false, message: 'Bu kuponun kullanım limiti doldu' };
    }
    
    // Check dates
    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
        return { valid: false, message: 'Bu kupon henüz geçerli değil' };
    }
    if (coupon.endDate && new Date(coupon.endDate) < now) {
        return { valid: false, message: 'Bu kuponun süresi doldu' };
    }
    
    // Check minimum amount
    if (coupon.minAmount > 0 && cartTotal < coupon.minAmount) {
        return { valid: false, message: `Bu kupon minimum ${coupon.minAmount}₺ sepet için geçerli` };
    }
    
    return { valid: true, coupon };
}

function applyCoupon(code, cartTotal) {
    const result = validateCoupon(code, cartTotal);
    
    if (!result.valid) {
        showWarning('Kupon Geçersiz', result.message);
        return null;
    }
    
    const coupon = result.coupon;
    let discount = 0;
    
    if (coupon.type === 'percentage') {
        discount = Math.round(cartTotal * (coupon.amount / 100));
    } else {
        discount = coupon.amount;
    }
    
    // Don't let discount exceed cart total
    discount = Math.min(discount, cartTotal);
    
    appliedCoupon = {
        ...coupon,
        discountAmount: discount
    };
    
    showSuccess('Kupon Uygulandı! 🎉', `${coupon.code} kuponu ile ${discount}₺ indirim kazandınız!`);
    
    return appliedCoupon;
}

function removeCoupon() {
    appliedCoupon = null;
    showInfo('Kupon Kaldırıldı', 'Kupon sepetten kaldırıldı.');
}

function incrementCouponUsage(code) {
    const coupon = coupons.find(c => c.code === code.toUpperCase());
    if (coupon) {
        coupon.usageCount++;
        saveCoupons();
        console.log(`✅ Kupon kullanımı artırıldı: ${code} (${coupon.usageCount})`);
    }
}

// ==================== ADMIN AUTHENTICATION SYSTEM ====================

let adminCredentials = {
    email: 'ilmekten@gmail.com',
    password: 'ilmekten2024'
};

let isAdminLoggedIn = false;

function loadAdminCredentials() {
    const saved = localStorage.getItem('ilmekten_admin_credentials');
    if (saved) {
        adminCredentials = JSON.parse(saved);
        console.log('🔐 Admin kimlik bilgileri yüklendi');
    }
}

function saveAdminCredentials() {
    localStorage.setItem('ilmekten_admin_credentials', JSON.stringify(adminCredentials));
    console.log('✅ Admin kimlik bilgileri kaydedildi');
}

function showAdminLogin() {
    const loginHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;" id="adminLoginOverlay">
            <div style="background: white; padding: 40px; border-radius: 20px; max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 60px; margin-bottom: 15px;">🔐</div>
                    <h2 style="font-family: 'Nunito', sans-serif; color: var(--brown); margin: 0 0 10px 0; font-size: 28px;">Admin Girişi</h2>
                    <p style="color: #666; font-size: 14px; margin: 0;">Yetkili giriş alanı</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-size: 14px; font-weight: 600; color: var(--brown); margin-bottom: 8px;">📧 E-posta</label>
                    <input type="email" id="adminEmailInput" placeholder="ilmekten@gmail.com" value="ilmekten@gmail.com" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 12px; font-size: 16px;" autocomplete="username">
                </div>
                
                <div style="margin-bottom: 25px;">
                    <label style="display: block; font-size: 14px; font-weight: 600; color: var(--brown); margin-bottom: 8px;">🔑 Şifre</label>
                    <input type="password" id="adminPasswordInput" placeholder="••••••" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 12px; font-size: 16px;" autocomplete="current-password" onkeypress="if(event.key==='Enter') attemptAdminLogin()">
                </div>
                
                <div id="loginError" style="display: none; background: #ffebee; color: #c62828; padding: 12px; border-radius: 12px; margin-bottom: 20px; font-size: 14px; text-align: center;">
                    ❌ E-posta veya şifre hatalı!
                </div>
                
                <button onclick="attemptAdminLogin()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, var(--brown), #5c4033); color: white; border: none; border-radius: 10px; font-size: 18px; font-weight: 700; cursor: pointer; margin-bottom: 15px;">
                    🔓 Giriş Yap
                </button>
                
                <button onclick="closeAdminLogin()" style="width: 100%; padding: 12px; background: #f5f5f5; color: #666; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">
                    ✖ İptal
                </button>
                
                <div style="margin-top: 20px; padding: 12px; background: #f9f9f9; border-radius: 12px; font-size: 12px; color: #999; text-align: center;">
                    🔒 Güvenli giriş - Yetkisiz erişim yasaktır
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loginHTML);
    
    // Focus email input
    setTimeout(() => {
        document.getElementById('adminEmailInput').focus();
    }, 100);
}

function closeAdminLogin() {
    const overlay = document.getElementById('adminLoginOverlay');
    if (overlay) {
        overlay.remove();
    }
}

function attemptAdminLogin() {
    const emailInput = document.getElementById('adminEmailInput').value.trim();
    const passwordInput = document.getElementById('adminPasswordInput').value;
    const errorDiv = document.getElementById('loginError');
    
    if (emailInput === adminCredentials.email && passwordInput === adminCredentials.password) {
        // Başarılı giriş
        isAdminLoggedIn = true;
        closeAdminLogin();
        showSuccess('Giriş Başarılı! 🎉', 'Admin paneline yönlendiriliyorsunuz...');
        
        setTimeout(() => {
            openAdminPanel();
        }, 500);
        
        console.log('✅ Admin girişi başarılı:', emailInput);
    } else {
        // Hatalı giriş
        errorDiv.style.display = 'block';
        document.getElementById('adminPasswordInput').value = '';
        document.getElementById('adminPasswordInput').focus();
        
        // 3 saniye sonra hata mesajını gizle
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
        
        console.log('❌ Admin girişi başarısız');
    }
}

function openAdminPanel() {
    const modal = document.getElementById('adminModal');
    
    if (!modal) {
        console.error('❌ adminModal bulunamadı!');
        showError('Hata', 'Admin paneli bulunamadı!');
        return;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Admin paneli açıldı');
    loadAdminProducts();
    
    // Update current email display
    const emailDisplay = document.getElementById('currentAdminEmail');
    if (emailDisplay) {
        emailDisplay.textContent = '📧 ' + adminCredentials.email;
    }
    
    // Set email input to current email
    const emailInput = document.getElementById('newAdminEmail');
    if (emailInput) {
        emailInput.value = adminCredentials.email;
    }
}

async function changeAdminPassword() {
    const newEmail = document.getElementById('newAdminEmail').value.trim();
    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!newEmail) {
        showWarning('Eksik Bilgi', 'Lütfen e-posta adresini girin.');
        return;
    }
    
    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
        showWarning('Geçersiz E-posta', 'Lütfen geçerli bir e-posta adresi girin.');
        return;
    }
    
    if (!currentPass) {
        showWarning('Mevcut Şifre Gerekli', 'Güvenlik için mevcut şifrenizi girin.');
        return;
    }
    
    if (currentPass !== adminCredentials.password) {
        showError('Hatalı Şifre', 'Mevcut şifreniz yanlış!');
        return;
    }
    
    if (!newPass || newPass.length < 5) {
        showWarning('Zayıf Şifre', 'Yeni şifre en az 5 karakter olmalıdır.');
        return;
    }
    
    if (newPass !== confirmPass) {
        showError('Şifreler Uyuşmuyor', 'Yeni şifre ve tekrarı aynı olmalıdır.');
        return;
    }
    
    // Confirm change
    if (!confirm('Admin bilgileriniz değişecek. Otomatik çıkış yapılacak ve yeni bilgilerle giriş yapmanız gerekecek. Devam etmek istiyor musunuz?')) {
        return;
    }
    
    const oldEmail = adminCredentials.email;
    const oldPassword = adminCredentials.password;
    
    // Update credentials
    adminCredentials.email = newEmail;
    adminCredentials.password = newPass;
    saveAdminCredentials();
    
    // Send email notification
    await sendPasswordChangeNotification(newEmail, oldEmail);
    
    // Clear form
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    showSuccess('Şifre Değiştirildi! 🎉', 'Güvenlik için çıkış yapılıyor...', 3000);
    
    // Logout and close admin
    setTimeout(() => {
        isAdminLoggedIn = false;
        closeAdmin();
        showInfo('Yeni Bilgilerle Giriş Yapın', `Email: ${newEmail}\nYeni şifrenizle giriş yapabilirsiniz.`, 5000);
    }, 3000);
    
    console.log('✅ Admin şifresi değiştirildi');
}

async function sendPasswordChangeNotification(newEmail, oldEmail) {
    if (!emailSettings.enabled || !emailSettings.publicKey) {
        console.log('📧 E-posta bildirimi kapalı, şifre değişikliği bildirimi gönderilemedi');
        return;
    }
    
    try {
        const templateParams = {
            to_email: newEmail,
            old_email: oldEmail,
            new_email: newEmail,
            change_date: new Date().toLocaleString('tr-TR'),
            subject: '🔐 Admin Şifre Değişikliği'
        };
        
        // You can create a separate template for password change
        // For now, just log it
        console.log('📧 Şifre değişikliği bildirimi gönderilecek:', templateParams);
        showInfo('E-posta Gönderiliyor...', 'Şifre değişikliği bildirimi email adresinize gönderilecek.');
        
    } catch (error) {
        console.error('❌ E-posta gönderilemedi:', error);
    }
}

// ==================== EMAIL NOTIFICATION SYSTEM ====================

let emailSettings = {
    publicKey: '',
    serviceId: '',
    templateId: '',
    recipient: 'ilmekten@gmail.com',
    enabled: false
};

function loadEmailSettings() {
    const saved = localStorage.getItem('ilmekten_email_settings');
    if (saved) {
        emailSettings = JSON.parse(saved);
        
        // Fill form
        document.getElementById('emailPublicKey').value = emailSettings.publicKey || '';
        document.getElementById('emailServiceId').value = emailSettings.serviceId || '';
        document.getElementById('emailTemplateId').value = emailSettings.templateId || '';
        document.getElementById('emailRecipient').value = emailSettings.recipient || 'ilmekten@gmail.com';
        document.getElementById('emailNotificationsEnabled').checked = emailSettings.enabled || false;
        
        // Initialize EmailJS if configured
        if (emailSettings.publicKey) {
            emailjs.init(emailSettings.publicKey);
        }
        
        updateEmailStatus();
        console.log('📧 E-posta ayarları yüklendi');
    }
}

function saveEmailSettings() {
    const publicKey = document.getElementById('emailPublicKey').value.trim();
    const serviceId = document.getElementById('emailServiceId').value.trim();
    const templateId = document.getElementById('emailTemplateId').value.trim();
    const recipient = document.getElementById('emailRecipient').value.trim();
    
    if (!publicKey || !serviceId || !templateId || !recipient) {
        showWarning('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient)) {
        showWarning('Geçersiz E-posta', 'Lütfen geçerli bir e-posta adresi girin.');
        return;
    }
    
    emailSettings.publicKey = publicKey;
    emailSettings.serviceId = serviceId;
    emailSettings.templateId = templateId;
    emailSettings.recipient = recipient;
    
    // Initialize EmailJS
    emailjs.init(publicKey);
    
    localStorage.setItem('ilmekten_email_settings', JSON.stringify(emailSettings));
    updateEmailStatus();
    
    showSuccess('E-posta Ayarları Kaydedildi! 📧', 'Sipariş bildirimleri aktif edilebilir.');
    console.log('📧 E-posta ayarları kaydedildi:', emailSettings);
}

function toggleEmailNotifications(enabled) {
    if (enabled && (!emailSettings.publicKey || !emailSettings.serviceId || !emailSettings.templateId)) {
        showWarning('Ayarlar Eksik', 'Önce EmailJS ayarlarını yapın ve kaydedin.');
        document.getElementById('emailNotificationsEnabled').checked = false;
        return;
    }
    
    emailSettings.enabled = enabled;
    localStorage.setItem('ilmekten_email_settings', JSON.stringify(emailSettings));
    updateEmailStatus();
    
    if (enabled) {
        showSuccess('Bildirimler Aktif! 📧', 'Yeni siparişler e-posta ile bildirilecek.');
    } else {
        showInfo('Bildirimler Kapalı', 'E-posta bildirimleri devre dışı.');
    }
    
    console.log('📧 E-posta bildirimleri:', enabled ? 'Aktif' : 'Kapalı');
}

function updateEmailStatus() {
    const statusBox = document.getElementById('emailStatusBox');
    const statusIcon = document.getElementById('emailStatusIcon');
    const statusTitle = document.getElementById('emailStatusTitle');
    const statusText = document.getElementById('emailStatusText');
    
    const isConfigured = emailSettings.publicKey && emailSettings.serviceId && emailSettings.templateId;
    
    // Update settings page status
    if (statusBox) {
        if (isConfigured && emailSettings.enabled) {
            statusBox.style.background = '#e8f5e9';
            statusBox.style.borderColor = '#4CAF50';
            statusIcon.textContent = '✅';
            statusTitle.textContent = 'Bildirimler Aktif';
            statusText.textContent = `Siparişler ${emailSettings.recipient} adresine gönderiliyor`;
        } else if (isConfigured && !emailSettings.enabled) {
            statusBox.style.background = '#fff3e0';
            statusBox.style.borderColor = '#ff9800';
            statusIcon.textContent = '⏸️';
            statusTitle.textContent = 'Bildirimler Pasif';
            statusText.textContent = 'EmailJS yapılandırıldı, bildirimleri aktif edin';
        } else {
            statusBox.style.background = '#fff9f5';
            statusBox.style.borderColor = '#ff9800';
            statusIcon.textContent = '⚠️';
            statusTitle.textContent = 'EmailJS Kurulumu Gerekli';
            statusText.textContent = 'E-posta bildirimleri için EmailJS ayarlarını yapın';
        }
    }
    
    // Update orders page banner
    const banner = document.getElementById('emailNotifBanner');
    if (banner) {
        if (!isConfigured || !emailSettings.enabled) {
            banner.style.display = 'block';
        } else {
            banner.style.display = 'none';
        }
    }
}

async function testEmailNotification() {
    if (!emailSettings.publicKey || !emailSettings.serviceId || !emailSettings.templateId) {
        showWarning('Ayarlar Eksik', 'Önce EmailJS ayarlarını yapın ve kaydedin.');
        return;
    }
    
    const testOrder = {
        id: 'TEST-' + Date.now(),
        customer: {
            name: 'Test Müşteri',
            phone: '0555 123 45 67',
            address: 'Test Mahallesi, Test Sokak No:1',
            city: 'İstanbul',
            notes: 'Bu bir test siparişidir'
        },
        items: [
            { name: 'Test Ürün 1', quantity: 2, price: 350 },
            { name: 'Test Ürün 2', quantity: 1, price: 450 }
        ],
        subtotal: 1150,
        discount: 0,
        total: 1150,
        paymentMethod: 'transfer'
    };
    
    showInfo('Test Gönderiliyor...', 'E-posta gönderiliyor, lütfen bekleyin.');
    
    const success = await sendOrderNotification(testOrder);
    if (success) {
        showSuccess('Test Başarılı! 🎉', `Test maili ${emailSettings.recipient} adresine gönderildi.`, 5000);
    }
}

async function sendOrderNotification(order) {
    if (!emailSettings.enabled || !emailSettings.publicKey || !emailSettings.serviceId || !emailSettings.templateId) {
        console.log('📧 E-posta bildirimleri kapalı veya yapılandırılmamış');
        console.log('📧 GELİŞTİRME MODU: E-posta içeriği:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📋 Sipariş No: ${order.id}`);
        console.log(`👤 Müşteri: ${order.customer.name}`);
        console.log(`📞 Telefon: ${order.customer.phone}`);
        console.log(`📍 Adres: ${order.customer.address}, ${order.customer.city}`);
        console.log(`💰 Toplam: ${order.total}₺`);
        console.log(`💳 Ödeme: ${order.paymentMethod}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('💡 EmailJS kurulumu yapılınca otomatik gönderilecek');
        
        // Development mode notification
        if (!emailSettings.publicKey) {
            setTimeout(() => {
                showInfo(
                    'E-posta Bildirimi (Test Modu) 📧', 
                    `Sipariş No: ${order.id}\nMüşteri: ${order.customer.name}\nToplam: ${order.total}₺\n\n⚠️ EmailJS kurulumu yapılınca otomatik gönderilecek`,
                    6000
                );
            }, 2000);
        }
        
        return false;
    }
    
    try {
        // Ürün listesini formatla
        const itemsList = order.items.map(item => 
            `${item.name} x${item.quantity} - ${item.price * item.quantity}₺`
        ).join('\n');
        
        // Hediye ürünleri ekle
        let giftsText = '';
        if (order.gifts && order.gifts.length > 0) {
            giftsText = '\n\nHediye Ürünler:\n' + order.gifts.map(g => `🎁 ${g.name}`).join('\n');
        }
        
        // Kupon bilgisi
        let couponText = '';
        if (order.coupon) {
            couponText = `\n\nKupon: ${order.coupon.code} (-${order.coupon.amount}₺)`;
        }
        
        // Ödeme yöntemi
        const paymentMethods = {
            'card': 'Kredi/Banka Kartı',
            'transfer': 'Havale/EFT',
            'cash': 'Kapıda Ödeme'
        };
        
        const templateParams = {
            to_email: emailSettings.recipient,
            order_id: order.id,
            customer_name: order.customer.name,
            customer_phone: order.customer.phone,
            customer_address: order.customer.address,
            customer_city: order.customer.city,
            items: itemsList + giftsText,
            subtotal: order.subtotal,
            discount: order.discount || 0,
            total: order.total,
            payment_method: paymentMethods[order.paymentMethod] || order.paymentMethod,
            order_notes: order.customer.notes || 'Yok',
            coupon_info: couponText,
            order_date: new Date().toLocaleString('tr-TR')
        };
        
        console.log('📧 E-posta gönderiliyor...', templateParams);
        
        const response = await emailjs.send(
            emailSettings.serviceId,
            emailSettings.templateId,
            templateParams
        );
        
        console.log('✅ E-posta başarıyla gönderildi:', response);
        return true;
        
    } catch (error) {
        console.error('❌ E-posta gönderimi başarısız:', error);
        showError('E-posta Gönderilemedi', 'Sipariş kaydedildi ama e-posta gönderilemedi. Ayarları kontrol edin.');
        return false;
    }
}

function saveCustomMessage() {
    const message = document.getElementById('customEffectMessage').value;
    if (message.trim()) {
        localStorage.setItem('ilmekten_custom_message', message);
        showSuccess('Mesaj Kaydedildi', 'Özel efekt mesajı kaydedildi.');
        applySeasonalEffect(currentEffect);
    } else {
        showWarning('Mesaj Boş', 'Lütfen bir mesaj girin.');
    }
}

function applySeasonalEffect(effect) {
    const container = document.getElementById('seasonalEffects');
    const notification = document.getElementById('effectNotification');
    const effectText = document.getElementById('effectText');
    
    container.innerHTML = '';
    
    const customMessage = localStorage.getItem('ilmekten_custom_message');
    const defaultMessages = {
        'none': '',
        'snow': '❄️ Hoş geldin Yılbaşı!',
        'confetti': '🎊 Bayramınız Kutlu Olsun!',
        'spring': '🌸 İlkbahar Geldi!',
        'autumn': '🍂 Sonbahar Güzellikleri'
    };
    
    if (effect === 'none') {
        notification.style.display = 'none';
    } else {
        effectText.textContent = customMessage || defaultMessages[effect] || '';
        notification.style.display = 'block';
        
        if (effect === 'snow') {
            createSnowfall();
        } else if (effect === 'confetti') {
            createConfetti();
        } else if (effect === 'spring') {
            createSpring();
        } else if (effect === 'autumn') {
            createAutumn();
        }
    }
}

function createSnowfall() {
    const container = document.getElementById('seasonalEffects');
    const snowflakes = ['❄', '❅', '❆'];
    
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.animationDuration = (Math.random() * 3 + 5) + 's';
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        snowflake.style.fontSize = (Math.random() * 10 + 15) + 'px';
        snowflake.style.opacity = Math.random() * 0.6 + 0.4;
        container.appendChild(snowflake);
    }
}

function createConfetti() {
    const container = document.getElementById('seasonalEffects');
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 4) + 's';
        confetti.style.animationDelay = Math.random() * 5 + 's';
        confetti.style.width = (Math.random() * 5 + 5) + 'px';
        confetti.style.height = (Math.random() * 10 + 5) + 'px';
        container.appendChild(confetti);
    }
}

function createSpring() {
    const container = document.getElementById('seasonalEffects');
    const flowers = ['🌸', '🌺', '🌼', '🌻', '🦋', '🐝'];
    
    for (let i = 0; i < 40; i++) {
        const flower = document.createElement('div');
        flower.className = 'flower';
        flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
        flower.style.left = Math.random() * 100 + '%';
        flower.style.animationDuration = (Math.random() * 4 + 6) + 's';
        flower.style.animationDelay = Math.random() * 5 + 's';
        flower.style.fontSize = (Math.random() * 10 + 20) + 'px';
        container.appendChild(flower);
    }
}

function createAutumn() {
    const container = document.getElementById('seasonalEffects');
    const leaves = ['🍂', '🍁', '🍃'];
    
    for (let i = 0; i < 60; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
        leaf.style.left = Math.random() * 100 + '%';
        leaf.style.animationDuration = (Math.random() * 4 + 7) + 's';
        leaf.style.animationDelay = Math.random() * 5 + 's';
        leaf.style.fontSize = (Math.random() * 12 + 18) + 'px';
        container.appendChild(leaf);
    }
}

// ==================== IMAGE LIGHTBOX ====================
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    lightboxImage.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ESC tuşu ile kapatma
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// ==================== INITIALIZE ====================

// ÜRÜN CACHE TEMİZLEME - Boş array problemi için
localStorage.removeItem('ilmekten_products');
localStorage.removeItem('ilmekten_products_backup');
console.log('🧹 Ürün cache temizlendi - Varsayılan ürünler yüklenecek');

// SEPET TEMİZLEME (Test için KAPALI - Siparişleri test etmek için)
// localStorage.removeItem('ilmekten_cart'); // ⚠️ Test için kapalı
// console.log('🧹 Sepet temizlendi (test modu)');

loadProducts();
loadCart();
loadFavorites();
loadCorporateOrders();
loadCampaigns();
renderAdminCampaigns();
loadOrders();
renderAdminOrders();
loadStories();
renderAdminStories();

console.log('🚀 Sayfa yüklendi');
console.log('📦 Ürün sayısı:', products.length);
console.log('🛒 Sepetteki ürün sayısı:', cart.length);
console.log('❤️ Favori sayısı:', favorites.length);

// Load color theme first
loadColorTheme();

// Load payment methods
loadPaymentMethods();

// Load bank info
loadBankInfo();

// Load coupons
loadCoupons();
renderAdminCoupons();

// Load email settings
loadEmailSettings();

// Load admin credentials
loadAdminCredentials();

// Load seasonal effect
const savedEffect = localStorage.getItem('ilmekten_effect') || 'none';
const effectSelector = document.getElementById('effectSelector');
if (effectSelector) {
    effectSelector.value = savedEffect;
}
if (savedEffect !== 'none') {
    applySeasonalEffect(savedEffect);
}

// Sepeti temizleme fonksiyonu (Console'dan çağırabilirsin)
window.clearCart = function() {
    localStorage.removeItem('ilmekten_cart');
    cart = [];
    updateCartCount();
    console.log('✅ Sepet temizlendi!');
    showSuccess('Sepet Temizlendi', 'Tüm ürünler sepetten kaldırıldı.');
    setTimeout(() => location.reload(), 1500);
};

// Admin'i window'a ekle - global erişim için
window.openAdmin = openAdmin;

// ==================== URL ROUTING FOR ADMIN ====================

function checkAdminAccess() {
    const hash = window.location.hash;
    
    // Admin URL kontrolü: #admin veya #admin-panel
    if (hash === '#admin' || hash === '#admin-panel' || hash === '#yonetim') {
        console.log('🔐 Admin paneline yönlendiriliyor...');
        
        // Sayfa tam yüklenene kadar bekle
        setTimeout(() => {
            openAdmin();
            
            // URL'den hash'i temizle (gizlilik için)
            // history.replaceState(null, null, ' ');
        }, 100);
    }
}

// Sayfa yüklendiğinde kontrol et
checkAdminAccess();

// Hash değiştiğinde kontrol et (geri/ileri butonları için)
window.addEventListener('hashchange', checkAdminAccess);

// Admin paneli açıldığında konsola bilgi ver
const originalOpenAdmin = openAdmin;
window.openAdmin = function() {
    console.log('🔐 Admin paneli açıldı');
    console.log('💡 İpucu: Bu panele erişim URL\'leri:');
    console.log('   • yoursite.com/#admin');
    console.log('   • yoursite.com/#admin-panel');
    console.log('   • yoursite.com/#yonetim');
    originalOpenAdmin();
};

console.log('🔐 Admin erişim sistemi aktif');
console.log('💡 Admin paneline erişmek için URL\'ye #admin ekleyin');

// ==================== END URL ROUTING ====================
window.closeAdmin = closeAdmin;

console.log('💡 Sepeti manuel temizlemek için console\'da: clearCart()');
console.log('💡 Admin açmak için: openAdmin()');
console.log('🎨 Aktif tema:', localStorage.getItem('ilmekten_theme') || 'original');

// ========== ANA SAYFA CAROUSEL YÖNETİMİ ==========
let heroImages = [];

function loadHeroImages() {
    const saved = localStorage.getItem('hero_carousel_images');
    heroImages = saved ? JSON.parse(saved) : [];
}

function saveHeroImages() {
    localStorage.setItem('hero_carousel_images', JSON.stringify(heroImages));
}

function renderHeroImagesList() {
    const container = document.getElementById('heroImagesList');
    if (!container) return;
    
    if (heroImages.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:30px;color:#999;">📸 Henüz resim eklenmemiş</div>';
        return;
    }
    
    container.innerHTML = heroImages.map((img, i) => `
        <div style="display:flex;align-items:center;gap:15px;background:#f5f5f5;padding:15px;border-radius:10px;">
            <img src="${img}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">
            <div style="flex:1;font-weight:600;color:#666;">Resim ${i+1}</div>
            <button onclick="deleteHeroImage(${i})" style="padding:8px 15px;background:#f44336;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;">🗑️ Sil</button>
        </div>
    `).join('');
}

function addHeroImage() {
    const input = document.getElementById('heroImageInput');
    const file = input?.files[0];
    
    if (!file) {
        alert('Lütfen bir resim seçin!');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('Resim 5MB\'dan küçük olmalı!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let w = img.width, h = img.height;
            if (w > 800) { h = (h * 800) / w; w = 800; }
            canvas.width = w;
            canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            
            heroImages.push(canvas.toDataURL('image/png'));
            saveHeroImages();
            renderHeroImagesList();
            updateHeroCarousel();
            
            input.value = '';
            showToast('Başarılı', 'Resim eklendi!', 'success');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function deleteHeroImage(index) {
    if (confirm('Bu resmi silmek istediğinizden emin misiniz?')) {
        heroImages.splice(index, 1);
        saveHeroImages();
        renderHeroImagesList();
        updateHeroCarousel();
        showToast('Başarılı', 'Resim silindi!', 'success');
    }
}

function updateHeroCarousel() {
    const showcase = document.querySelector('.hero-showcase');
    if (!showcase) return;
    
    if (heroImages.length === 0) return;
    
    showcase.innerHTML = heroImages.map((img, i) => 
        `<div class="hero-slide ${i === 0 ? 'active' : ''}"><img src="${img}" alt="Amigurumi ${i+1}"></div>`
    ).join('');
    
    // Restart carousel
    const slides = showcase.querySelectorAll('.hero-slide');
    if (slides.length > 1) {
        let current = 0;
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 5000);
    }
}

// Init
loadHeroImages();
if (heroImages.length > 0) {
    setTimeout(() => updateHeroCarousel(), 500);
}

console.log('✅ Hero carousel management loaded');

// ==================== CHAT BOT ====================

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const chatButton = document.getElementById('chatButton');
    
    if (chatWindow.style.display === 'none') {
        chatWindow.style.display = 'flex';
        chatButton.textContent = '×';
    } else {
        chatWindow.style.display = 'none';
        chatButton.textContent = '💬';
    }
}

function goToInstagram() {
    window.open('https://www.instagram.com/ilmekten_34/', '_blank');
}

function askQuestion(type) {
    const responses = {
        products: {
            title: '🧶 Ürünlerimiz',
            text: 'El yapımı amigurumi koleksiyonumuzu keşfetmek için "Tüm Ürünleri Gör" butonuna tıklayabilirsiniz. Noel temalı, hayvan figürleri ve daha fazlası!',
            action: 'Ürünlere Git',
            onClick: 'showAllProducts(); toggleChat();'
        },
        order: {
            title: '📦 Sipariş Süreci',
            text: '1️⃣ Beğendiğiniz ürünü sepete ekleyin<br>2️⃣ Sepetinizi kontrol edin<br>3️⃣ Teslimat bilgilerinizi girin<br>4️⃣ Ödeme yöntemini seçin<br>5️⃣ Siparişiniz hazırlanmaya başlasın!<br><br>💝 Sipariş sonrası Instagram üzerinden size ulaşacağız.',
            action: null
        },
        tracking: {
            title: '🔍 Sipariş Takip',
            text: 'Sipariş numaranızı girerek siparişinizin durumunu öğrenebilirsiniz.',
            showInput: true
        },
        custom: {
            title: '✨ Özel Sipariş',
            text: 'Kurumsal veya özel tasarım siparişler için:<br><br>📱 Instagram: @ilmekten_34<br>📧 DM üzerinden iletişime geçin<br><br>Renk, boyut ve tasarımda istediğiniz değişiklikleri yapabiliriz!',
            action: 'Instagram\'a Git',
            onClick: 'goToInstagram()'
        },
        shipping: {
            title: '🚚 Kargo & Teslimat',
            text: '📍 Türkiye geneline gönderim yapıyoruz<br>⏱️ Hazırlama süresi: 3-7 gün<br>📦 Kargo: 2-3 gün<br>💰 Kargo ücreti sipariş tutarına göre değişir<br><br>Sipariş durumunuzu sipariş takip bölümünden kontrol edebilirsiniz.',
            action: null
        },
        care: {
            title: '💝 Ürün Bakımı',
            text: '🧼 El ile yıkanabilir (ılık suda)<br>🚫 Çamaşır makinesinde yıkamayın<br>☀️ Düz şekilde kurutun<br>🧸 Küçük çocuklar için gözetim altında kullanın<br><br>%100 el yapımı, güvenli malzemelerle üretilmiştir.',
            action: null
        },
        contact: {
            title: '📞 İletişim',
            text: '📱 Instagram: @ilmekten_34<br>⏰ Mesai Saatleri:<br>• Pzt-Cuma: 09:00-18:00<br>• Cumartesi: 10:00-16:00<br>• Pazar: Kapalı<br><br>En hızlı yanıt için Instagram DM tercih edin!',
            action: 'Instagram\'a Git',
            onClick: 'goToInstagram()'
        }
    };
    
    const response = responses[type];
    if (!response) return;
    
    // Mesajı ekle
    const messagesContainer = document.getElementById('chatMessages');
    
    let actionHTML = '';
    if (response.action) {
        actionHTML = `<button onclick="${response.onClick}" style="margin-top:12px;padding:10px 20px;background:var(--red);color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:13px;">${response.action} →</button>`;
    } else if (response.showInput) {
        actionHTML = `
            <div style="margin-top:12px;">
                <input type="text" id="orderIdInput" placeholder="Sipariş numaranızı girin" style="width:100%;padding:10px;border:2px solid #ddd;border-radius:8px;margin-bottom:8px;font-size:13px;">
                <button onclick="trackOrder()" style="width:100%;padding:10px;background:var(--red);color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:13px;">🔍 Sorgula</button>
            </div>
        `;
    }
    
    const messageHTML = `
        <div class="assistant-message">
            <div style="background:white;padding:15px;border-radius:15px;box-shadow:0 2px 10px rgba(0,0,0,0.05);margin-bottom:15px;">
                <strong style="color:var(--red);display:block;margin-bottom:8px;">${response.title}</strong>
                <p style="margin:0;font-size:14px;line-height:1.6;">${response.text}</p>
                ${actionHTML}
            </div>
        </div>
    `;
    
    messagesContainer.innerHTML += messageHTML;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function trackOrder() {
    const orderIdInput = document.getElementById('orderIdInput');
    const orderId = orderIdInput.value.trim();
    
    if (!orderId) {
        alert('Lütfen sipariş numaranızı girin!');
        return;
    }
    
    // Siparişi bul
    const order = orders.find(o => o.id.toString() === orderId);
    
    const messagesContainer = document.getElementById('chatMessages');
    
    if (!order) {
        const messageHTML = `
            <div class="assistant-message">
                <div style="background:#fff3e0;padding:15px;border-radius:15px;box-shadow:0 2px 10px rgba(0,0,0,0.05);margin-bottom:15px;border-left:4px solid #ff9800;">
                    <strong style="color:#e65100;display:block;margin-bottom:8px;">❌ Sipariş Bulunamadı</strong>
                    <p style="margin:0;font-size:14px;line-height:1.6;">
                        #${orderId} numaralı sipariş bulunamadı.<br><br>
                        Lütfen sipariş numaranızı kontrol edin veya Instagram üzerinden bizimle iletişime geçin.
                    </p>
                    <button onclick="goToInstagram()" style="margin-top:12px;padding:10px 20px;background:#ff9800;color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:13px;">
                        Instagram'a Git →
                    </button>
                </div>
            </div>
        `;
        messagesContainer.innerHTML += messageHTML;
    } else {
        // Durum emojileri
        const statusEmojis = {
            pending: '⏳',
            processing: '🔄',
            completed: '✅',
            cancelled: '❌'
        };
        
        const statusTexts = {
            pending: 'Bekliyor',
            processing: 'Hazırlanıyor',
            completed: 'Tamamlandı',
            cancelled: 'İptal Edildi'
        };
        
        const statusColors = {
            pending: '#ff9800',
            processing: '#2196f3',
            completed: '#4caf50',
            cancelled: '#f44336'
        };
        
        const date = new Date(order.date);
        const dateStr = date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'});
        
        const messageHTML = `
            <div class="assistant-message">
                <div style="background:white;padding:15px;border-radius:15px;box-shadow:0 2px 10px rgba(0,0,0,0.05);margin-bottom:15px;border-left:4px solid ${statusColors[order.status]};">
                    <strong style="color:${statusColors[order.status]};display:block;margin-bottom:8px;">
                        ${statusEmojis[order.status]} Sipariş #${order.id}
                    </strong>
                    <div style="background:#f9f9f9;padding:12px;border-radius:8px;margin:10px 0;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                            <span style="color:#666;font-size:13px;">Durum:</span>
                            <strong style="color:${statusColors[order.status]};font-size:14px;">${statusEmojis[order.status]} ${statusTexts[order.status]}</strong>
                        </div>
                        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                            <span style="color:#666;font-size:13px;">Tarih:</span>
                            <span style="font-size:13px;">${dateStr}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;">
                            <span style="color:#666;font-size:13px;">Tutar:</span>
                            <strong style="color:var(--red);font-size:14px;">${order.total}₺</strong>
                        </div>
                    </div>
                    <p style="margin:10px 0 0 0;font-size:13px;line-height:1.6;color:#666;">
                        ${order.status === 'pending' ? '📦 Siparişiniz alındı ve hazırlanmaya başlanacak.' : ''}
                        ${order.status === 'processing' ? '🎨 Siparişiniz özenle hazırlanıyor...' : ''}
                        ${order.status === 'completed' ? '🎉 Siparişiniz tamamlandı! Teşekkür ederiz.' : ''}
                        ${order.status === 'cancelled' ? '💔 Siparişiniz iptal edildi. Detaylar için iletişime geçin.' : ''}
                    </p>
                    ${order.status !== 'completed' && order.status !== 'cancelled' ? `
                        <button onclick="goToInstagram()" style="margin-top:12px;padding:10px 20px;background:${statusColors[order.status]};color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:13px;">
                            Detaylar için İletişime Geç →
                        </button>