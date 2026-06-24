/**
 * script.js — 凝香寻古 · 全站交互逻辑
 */

(function() {
    'use strict';

    /* ==========================================================
       1. 配置与状态
       ========================================================== */
    const CONFIG = {
        pages: [
            'intro', 'scene1', 'scene2', 'scene3',
            'home', 'history', 'spices', 'process', 'heritage',
            'interactive', 'heritage1', 'heritage2', 'heritage3'
        ],
        scenePages: ['scene1', 'scene2', 'scene3']
    };

    let currentPage = 'intro';
    let isMenuOpen = false;
    let isTransitioning = false;

    /* ==========================================================
       2. DOM 引用
       ========================================================== */
    const navMenu = document.getElementById('navMenu');
    const incenseBurner = document.getElementById('incenseBurner');
    const navItems = document.querySelectorAll('.nav-item');
    const sceneButtons = document.querySelectorAll('.btn-scene-next');
    const heritageButtons = document.querySelectorAll('.heritage-btn');
    const btnEnter = document.getElementById('btnEnterIntro');
    const btnInteractive = document.getElementById('btnToInteractive');

    const pageElements = {};
    CONFIG.pages.forEach(id => {
        pageElements[id] = document.getElementById('page-' + id);
    });

    /* ==========================================================
       3. 核心函数
       ========================================================== */

    function goToPage(pageId, options = {}) {
        if (isTransitioning) return;
        if (!pageElements[pageId]) return;
        if (pageId === currentPage && !options.force) return;

        isTransitioning = true;
        const oldPage = currentPage;

        Object.keys(pageElements).forEach(id => {
            const el = pageElements[id];
            el.classList.remove('active', 'scene-slide-up', 'scene-slide-in', 'fade-transition');
        });

        const targetEl = pageElements[pageId];
        targetEl.classList.add('active');

        if (options.sceneTransition) {
            if (oldPage && CONFIG.scenePages.includes(oldPage)) {
                const oldEl = pageElements[oldPage];
                oldEl.classList.add('scene-slide-up');
                setTimeout(() => oldEl.classList.remove('scene-slide-up'), 800);
            }
            targetEl.classList.add('scene-slide-in');
            setTimeout(() => targetEl.classList.remove('scene-slide-in'), 800);
        }

        currentPage = pageId;
        updateNavActive(pageId);

        if (isMenuOpen) {
            closeMenu();
        }

        // 如果是场景页，重新初始化交互
        if (CONFIG.scenePages.includes(pageId)) {
            setTimeout(function() {
                if (window.__REINIT_SCENE) {
                    window.__REINIT_SCENE();
                }
            }, 500);
        }

        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }

    function updateNavActive(pageId) {
        navItems.forEach(item => {
            const target = item.getAttribute('data-target');
            item.classList.toggle('active', target === pageId);
        });
    }

    function openMenu() {
        if (isMenuOpen) return;
        isMenuOpen = true;
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!isMenuOpen) return;
        isMenuOpen = false;
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    function toggleMenu() {
        isMenuOpen ? closeMenu() : openMenu();
    }

    function goToScene(nextPage) {
        if (isTransitioning) return;
        if (nextPage === 'home') {
            goToPage('home', { sceneTransition: true });
        } else if (CONFIG.scenePages.includes(nextPage)) {
            goToPage(nextPage, { sceneTransition: true });
        } else {
            goToPage(nextPage);
        }
    }

    /* ==========================================================
       4. 事件绑定
       ========================================================== */

    incenseBurner.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    btnEnter.addEventListener('click', function() {
        goToPage('scene1', { sceneTransition: false });
    });

    sceneButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const next = this.getAttribute('data-next');
            if (next) goToScene(next);
        });
    });

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target) {
                if (target === 'intro') {
                    closeMenu();
                    setTimeout(() => goToPage('intro'), 350);
                } else {
                    goToPage(target);
                    if (window.innerWidth <= 820) {
                        closeMenu();
                    }
                }
            }
        });
    });

    if (btnInteractive) {
        btnInteractive.addEventListener('click', function() {
            goToPage('interactive');
        });
    }

    heritageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target) goToPage(target);
        });
    });

    document.addEventListener('click', function(e) {
        if (isMenuOpen) {
            const isMenuClick = navMenu.contains(e.target) || incenseBurner.contains(e.target);
            if (!isMenuClick) {
                closeMenu();
            }
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) closeMenu();
    });

    /* ==========================================================
       5. 初始化
       ========================================================== */
    function init() {
        Object.keys(pageElements).forEach(id => {
            pageElements[id].classList.remove('active', 'scene-slide-up', 'scene-slide-in');
        });
        pageElements['intro'].classList.add('active');
        currentPage = 'intro';

        navMenu.classList.remove('active');
        isMenuOpen = false;

        updateNavActive('intro');

        console.log('✨ 凝香寻古 · 框架初始化完成');
    }

    init();

    window.__NXIANG = {
        goToPage: goToPage,
        toggleMenu: toggleMenu,
        openMenu: openMenu,
        closeMenu: closeMenu,
        getCurrentPage: () => currentPage,
        isMenuOpen: () => isMenuOpen,
        pages: CONFIG.pages,
        scenePages: CONFIG.scenePages
    };

})();


/**
 * ============================================================
 * 历史追溯 · 邮票轮播
 * ============================================================
 */

(function() {
    'use strict';

    var stampData = [
        { 
            bg: 'url(images/lishikapian1.png)', 
            text: '新石器时期（萌芽）',
            pageBg: '#bcb95c',
            stage: '第一阶段',
            fullTitle: '新石器时期（萌芽）',
            period: '约公元前 6000 年 — 前 2000 年',
            people: '氏族首领、巫师',
            herbs: '艾草、樟树、花椒等本土芳香草木',
            usage: '燎祭（烧草木升烟沟通天地神灵）、驱虫、净化居所除秽'
        },
        { 
            bg: 'url(images/lishikapian2.png)', 
            text: '夏商周时期（初成）',
            pageBg: '#8d8a85',
            stage: '第二阶段',
            fullTitle: '夏商周时期（初成）',
            period: '约公元前 2070 年 — 前 771 年',
            people: '天子、贵族、巫师，平民无权使用',
            herbs: '萧（蒿草）、黑黍、蕙草、花椒（全部本土草本谷物，无海外香料）',
            usage: '国家大典燎祭通神：燃萧升烟、罍酒灌地祭祀天地先祖；日常：香草煮水沐浴、芳香谷物酿造香酒'
        },
        { 
            bg: 'url(images/lishikapian3.png)', 
            text: '春秋战国时期（孕育）',
            pageBg: '#6d3414',
            stage: '第三阶段',
            fullTitle: '春秋战国时期（孕育）',
            period: '公元前 770 年 — 前 221 年',
            people: '文人雅士、贵族',
            herbs: '蘩、蘋、茅、蒲、艾、萧、兰、椒、蓍、蒿（全部本土草本香草，无海外香料）',
            usage: '随身佩戴香囊、香草沐浴、室内熏香、桂酒椒浆饮食、国家祭祀；香草象征品性高洁'
        },
        { 
            bg: 'url(images/lishikapian4.png)', 
            text: '秦汉时期（成型）',
            pageBg: '#cd362e',
            stage: '第四阶段',
            fullTitle: '秦汉时期（成型）',
            period: '公元前 221 年 — 公元 220 年',
            people: '皇室、上层贵族（汉武帝极度嗜香，推动举国熏香风气）',
            herbs: '本土：茅香、花椒、佩兰<br>进口：苏合香、龙脑、乳香、甲香（首次引入域外香料）',
            usage: '熏衣熏被、朝堂礼仪、佛道祭祀仪式、跨国香料贸易'
        },
        { 
            bg: 'url(images/lishikapian5.png)', 
            text: '魏晋南北朝（内化）',
            pageBg: '#6e421f',
            stage: '第五阶段',
            fullTitle: '魏晋南北朝（内化）',
            period: '公元 220 年 —581 年',
            people: '士大夫、文人、佛道僧道群体',
            herbs: '告别单一香料焚烧，开创多香材调和合香工艺，香材品类大幅扩充',
            usage: '文人风尚：熏衣、随身佩香；宗教：佛道焚香打坐、修行礼佛；日常：居家养生、诗文雅集咏香'
        },
        { 
            bg: 'url(images/lishikapian6.png)', 
            text: '隋唐时期（兴盛）',
            pageBg: '#639792',
            stage: '第六阶段',
            fullTitle: '隋唐时期（兴盛）',
            period: '公元581—907 年',
            people: '帝王百官、文人、寺院、富商，全民可用香(阶层限制大幅放宽)',
            herbs: '核心香材有沉香、檀香、龙脑、麝香；海陆双丝路并行，广州、扬州设香料市舶司，龙脑、安息香、甲香大规模进口；本土花草、草本作为调和辅料',
            usage: '宫廷奢华熏香、寺院供香、随身金银香囊、文人雅集、芳香药疗医疗'
        },
        { 
            bg: 'url(images/lishikapian7.png)', 
            text: '两宋（鼎盛）',
            pageBg: '#2b55a2',
            stage: '第七阶段',
            fullTitle: '两宋（鼎盛）',
            period: '公元960—1271年',
            people: '无阶层限制，帝王、文人、百姓、僧道皆品香',
            herbs: '沉香、檀香、龙脑、丁香、苏合香、降真香<br>香方两大体系:宫廷帐香：鹅梨帐中香、宣和贵妃王氏金香、宋宣和御制香；文人雅香：二苏旧局、清远香、沉香熟水香',
            usage: '四般闲事（焚香点茶挂画插花）、香谱著述（《香谱》《陈氏香谱》）、香道文人化'
        },
        { 
            bg: 'url(images/lishikapian8.png)', 
            text: '元代（短暂沉寂）',
            pageBg: '#1f632c',
            stage: '第八阶段',
            fullTitle: '元代（短暂沉寂）',
            period: '公元1271—1368年',
            people: '仅宫廷贵族、大型寺院保留熏香习惯，民间大幅简化',
            herbs: '无传世经典合香方留存',
            usage: '简易线香诞生，省去复杂合香、隔火熏制流程，便于普通百姓祭祀使用'
        },
        { 
            bg: 'url(images/lishikapian9.png)', 
            text: '明清时期（普及）',
            pageBg: '#593464',
            stage: '第九阶段',
            fullTitle: '明清时期（普及）',
            period: '公元 1368 年 —1912 年',
            people: '全民普及，上至皇宫、下至市井平民均可制香、用香',
            herbs: '线香、盘香、香丸、香饼、花果香、药香、和香全部成熟；《本草纲目》记载芳香药香配伍工艺；传世香方：寿阳公主梅花香、李主帐中梅花香、柏子香、益气香珠',
            usage: '祭祀礼佛、篆香计时（香钟）、居家熏香、随身佩戴香囊'
        },
        { 
            bg: 'url(images/lishikapian10.png)', 
            text: '近现代（非遗复兴）',
            pageBg: '#e76d0d',
            stage: '第十阶段',
            fullTitle: '近现代（非遗复兴）',
            period: '2000 年至今',
            people: '非遗传承人、香文化研究者、爱好者',
            herbs: '莞香制作技艺（国家级非遗）、永春篾香、小冈香、传统和香制作技艺（省级非遗）列入官方保护名录',
            usage: '国家级非遗保护（永春香、莞香等）、传统制香技艺复兴、现代香道文化推广'
        }
    ];

    var currentIndex = 0;
    var total = stampData.length;
    var isAnimating = false;

    var track = document.getElementById('carouselTrack');
    if (!track) return;

    function updatePageBackground(index) {
        var historyPage = document.getElementById('page-history');
        if (!historyPage) return;
        var data = stampData[index];
        if (data && data.pageBg) {
            historyPage.style.background = 'radial-gradient(ellipse at 50% 40%, ' + data.pageBg + ' 0%, #1e1510 80%)';
        }
    }

    var modalOverlay = document.getElementById('modalOverlay');
    var modalBg = document.getElementById('modalBg');
    var modalStage = document.getElementById('modalStage');
    var modalTitle = document.getElementById('modalTitle');
    var modalPeriod = document.getElementById('modalPeriod');
    var modalPeople = document.getElementById('modalPeople');
    var modalHerbs = document.getElementById('modalHerbs');
    var modalUsage = document.getElementById('modalUsage');
    var modalClose = document.getElementById('modalClose');

    function openModal(index) {
        var data = stampData[index];
        if (!data) return;
        modalBg.style.backgroundImage = data.bg || 'linear-gradient(135deg, #2c1810, #1e1510)';
        modalBg.style.backgroundSize = 'cover';
        modalBg.style.backgroundPosition = 'center';
        modalStage.textContent = data.stage || '';
        modalTitle.textContent = data.fullTitle || data.text;
        modalPeriod.textContent = data.period || '';
        modalPeople.textContent = data.people || '';
        modalHerbs.innerHTML = data.herbs || '';
        modalUsage.innerHTML = Array.isArray(data.usage) ? data.usage.join('<br>') : (data.usage || '');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
    });

    function renderCards() {
        track.innerHTML = '';
        stampData.forEach(function(item, index) {
            var card = document.createElement('div');
            card.className = 'stamp-card';
            card.dataset.index = index;
            var bgStyle = item.bg ? 'background-image: ' + item.bg + ';' : '';
            bgStyle += ' background-size: cover; background-position: center;';
            card.innerHTML = '<div class="stamp-illustration" style="' + bgStyle + '"></div><div class="stamp-info"><p class="stamp-text">' + item.text + '</p></div><div class="stamp-number">' + String(index + 1).padStart(2, '0') + '</div>';
            card.addEventListener('click', function(e) {
                e.stopPropagation();
                var idx = parseInt(this.dataset.index);
                if (idx === currentIndex) { openModal(idx); return; }
                if (isAnimating) return;
                if (currentIndex === 0 && idx === total - 1) return;
                if (currentIndex === total - 1 && idx === 0) return;
                if (idx === (currentIndex - 1 + total) % total) goToPrev();
                else if (idx === (currentIndex + 1) % total) goToNext();
            });
            track.appendChild(card);
        });
    }

    function updateCarousel() {
        var cards = track.querySelectorAll('.stamp-card');
        if (cards.length === 0) return;
        var prevIdx = (currentIndex - 1 + total) % total;
        var nextIdx = (currentIndex + 1) % total;
        updatePageBackground(currentIndex);
        cards.forEach(function(card, idx) {
            card.classList.remove('center', 'left', 'right', 'hidden', 'disabled');
            if (idx === currentIndex) card.classList.add('center');
            else if (idx === prevIdx) { card.classList.add('left'); if (currentIndex === 0) card.classList.add('disabled'); }
            else if (idx === nextIdx) { card.classList.add('right'); if (currentIndex === total - 1) card.classList.add('disabled'); }
            else card.classList.add('hidden');
        });
    }

    function goToPrev() {
        if (isAnimating || currentIndex === 0) return;
        isAnimating = true;
        currentIndex = (currentIndex - 1 + total) % total;
        updateCarousel();
        setTimeout(function() { isAnimating = false; }, 500);
    }

    function goToNext() {
        if (isAnimating || currentIndex === total - 1) return;
        isAnimating = true;
        currentIndex = (currentIndex + 1) % total;
        updateCarousel();
        setTimeout(function() { isAnimating = false; }, 500);
    }

    document.addEventListener('keydown', function(e) {
        var historyPage = document.getElementById('page-history');
        if (!historyPage || !historyPage.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); if (currentIndex > 0) goToPrev(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); if (currentIndex < total - 1) goToNext(); }
    });

    var touchStartX = 0;
    var wrapper = document.getElementById('carouselWrapper');
    if (wrapper) {
        wrapper.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        wrapper.addEventListener('touchend', function(e) {
            var diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) { if (currentIndex < total - 1) goToNext(); }
                else { if (currentIndex > 0) goToPrev(); }
            }
        }, { passive: true });
    }

    function initCarousel() {
        renderCards();
        currentIndex = 0;
        updatePageBackground(currentIndex);
        updateCarousel();
        requestAnimationFrame(function() {
            var cards = track.querySelectorAll('.stamp-card');
            cards.forEach(function(c) {
                c.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousel);
    } else {
        initCarousel();
    }

    window.__STAMP_CAROUSEL = {
        goToPrev: goToPrev,
        goToNext: goToNext,
        goToIndex: function(index) {
            if (isAnimating || index < 0 || index >= total) return;
            isAnimating = true;
            currentIndex = index;
            updatePageBackground(currentIndex);
            updateCarousel();
            setTimeout(function() { isAnimating = false; }, 500);
        },
        getCurrentIndex: function() { return currentIndex; },
        getTotal: function() { return total; }
    };

})();


/**
 * ============================================================
 * 场景页交互（视差 + 粒子 + 拖拽）
 * ============================================================
 */

(function() {
    'use strict';

    console.log('🎬 场景交互模块加载中...');

    // ============================================================
    // 全局状态
    // ============================================================
    var parallaxInited = false;
    var particlesInited = false;
    var dragBindings = {};

    // ============================================================
    // 1. 视差效果
    // ============================================================
    function initParallax() {
        if (parallaxInited) return;

        console.log('🔄 初始化视差效果...');

        var layers = document.querySelectorAll('#page-scene1 .layer, #page-scene2 .layer, #page-scene3 .layer');
        var smokeList = document.querySelectorAll('#page-scene1 .smoke, #page-scene2 .smoke, #page-scene3 .smoke');

        if (layers.length === 0 || smokeList.length === 0) {
            console.warn('⚠️ 场景元素未找到，延迟重试...');
            setTimeout(initParallax, 500);
            return;
        }

        console.log('  ✅ 找到图层:', layers.length, '个');
        console.log('  ✅ 找到烟雾:', smokeList.length, '个');

        var layerSpeed = [0.1, 0.15, 0.3];
        var floatSpeed = 0.03;

        if (window._parallaxHandler) {
            document.removeEventListener('mousemove', window._parallaxHandler);
        }

        window._parallaxHandler = function(e) {
            var w = window.innerWidth;
            var h = window.innerHeight;
            var offsetX = (e.clientX - w / 2) / w;
            var offsetY = (e.clientY - h / 2) / h;
            var base = 80;

            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                var speed = layerSpeed[i % layerSpeed.length];
                var x = offsetX * speed * base;
                var y = offsetY * speed * base;
                layer.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            }

            var sX = offsetX * floatSpeed * base;
            var sY = offsetY * floatSpeed * base;
            for (var j = 0; j < smokeList.length; j++) {
                smokeList[j].style.transform = 'translate(' + sX + 'px, ' + sY + 'px)';
            }
        };

        document.addEventListener('mousemove', window._parallaxHandler);
        parallaxInited = true;
        console.log('✅ 视差效果已初始化');
    }

    // ============================================================
    // 2. 粒子系统
    // ============================================================
    function initParticles() {
        if (particlesInited) return;

        console.log('🔄 初始化粒子系统...');

        var containers = document.querySelectorAll('#page-scene1 .particles-container, #page-scene2 .particles-container, #page-scene3 .particles-container');

        if (containers.length === 0) {
            console.warn('⚠️ 粒子容器未找到，延迟重试...');
            setTimeout(initParticles, 500);
            return;
        }

        console.log('  ✅ 找到粒子容器:', containers.length, '个');

        containers.forEach(function(container) {
            container.innerHTML = '';
            var particleList = [];

            for (var i = 0; i < 35; i++) {
                var p = document.createElement('div');
                p.className = 'particle';
                var size = Math.random() * 4 + 2;
                p.style.width = size + 'px';
                p.style.height = size + 'px';
                p.style.left = Math.random() * 100 + '%';
                p.style.top = Math.random() * 100 + '%';
                var dx = (Math.random() - 0.5) * 0.2;
                var dy = (Math.random() - 0.5) * 0.2;
                container.appendChild(p);
                particleList.push({ el: p, dx: dx, dy: dy });
            }

            function floatParticles() {
                for (var j = 0; j < particleList.length; j++) {
                    var item = particleList[j];
                    var l = parseFloat(item.el.style.left);
                    var t = parseFloat(item.el.style.top);
                    l += item.dx;
                    t += item.dy;
                    if (l < 0 || l > 100) item.dx *= -1;
                    if (t < 0 || t > 100) item.dy *= -1;
                    item.el.style.left = l + '%';
                    item.el.style.top = t + '%';
                }
                requestAnimationFrame(floatParticles);
            }
            floatParticles();
        });

        particlesInited = true;
        console.log('✅ 粒子系统已初始化');
    }

    // ============================================================
    // 3. 通用拖拽绑定
    // ============================================================
    function setupDragDrop(dragEl, dropEl, infoBox, options) {
        if (!dragEl || !dropEl || !infoBox) {
            console.warn('⚠️ 拖拽元素缺失');
            return false;
        }

        var dragId = dragEl.id || 'unknown';

        // 如果已投放，跳过
        if (dragEl.getAttribute('draggable') === 'false' || dragEl.style.display === 'none') {
            console.log('ℹ️ ' + dragId + ' 已投放，跳过绑定');
            return false;
        }

        // 检查是否已绑定，避免重复绑定
        if (dragBindings[dragId]) {
            console.log('ℹ️ ' + dragId + ' 已绑定，跳过');
            return true;
        }

        console.log('🔄 绑定拖拽:', dragId);

        // 克隆替换移除旧监听器
        var newDrag = dragEl.cloneNode(true);
        dragEl.parentNode.replaceChild(newDrag, dragEl);
        dragEl = document.getElementById(dragId);
        dragEl.setAttribute('draggable', 'true');
        dragEl.style.opacity = '1';
        dragEl.style.cursor = 'grab';

        var newDrop = dropEl.cloneNode(true);
        dropEl.parentNode.replaceChild(newDrop, dropEl);
        dropEl = document.getElementById(newDrop.id);
        dropEl.classList.remove('over');

        // 拖拽事件
        dragEl.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.info || options.defaultText || '');
            if (options.dataKey) {
                e.dataTransfer.setData(options.dataKey, 'true');
            }
            e.dataTransfer.setDragImage(this, 40, 40);
            this.style.opacity = '0.6';
            console.log('🔄 拖拽开始:', dragId);
        });

        dragEl.addEventListener('dragend', function() {
            this.style.opacity = '1';
        });

        // 投放区事件
        dropEl.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('over');
        });

        dropEl.addEventListener('dragleave', function() {
            this.classList.remove('over');
        });

        dropEl.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('over');

            var isValid = false;
            if (options.dataKey) {
                isValid = e.dataTransfer.getData(options.dataKey) === 'true';
            } else {
                isValid = true;
            }

            var text = e.dataTransfer.getData('text/plain');

            if (isValid) {
                var targetEl = document.getElementById(dragId);
                if (targetEl) {
                    if (options.hideOnDrop) {
                        targetEl.style.display = 'none';
                    }
                    targetEl.setAttribute('draggable', 'false');
                    // 香囊特殊处理：移动到人物位置
                    if (dragId === 'sachet' && options.moveTarget) {
                        targetEl.style.left = options.moveTarget.left || '18%';
                        targetEl.style.top = options.moveTarget.top || '70%';
                    }
                }
                infoBox.textContent = text || options.successText || '投放成功！';
                infoBox.classList.add('show');
                console.log('✅ 投放成功:', dragId);
                setTimeout(function() {
                    infoBox.classList.remove('show');
                }, 5000);
            } else {
                infoBox.textContent = options.errorText || '❌ 请拖拽正确的元素！';
                infoBox.classList.add('show');
                setTimeout(function() {
                    infoBox.classList.remove('show');
                }, 2000);
            }
        });

        dragBindings[dragId] = true;
        console.log('✅ 拖拽已绑定:', dragId);
        return true;
    }

    // ============================================================
    // 4. 场景交互初始化
    // ============================================================
    function initSceneInteractions() {
        console.log('🔄 开始初始化场景交互...');

        var infoBox = document.getElementById('infoBox');
        if (!infoBox) {
            console.error('❌ #infoBox 元素不存在！');
            return;
        }

        // 初始化视差和粒子（只执行一次）
        initParallax();
        initParticles();

        // ---- 香囊 ----
        var sachet = document.getElementById('sachet');
        var person = document.getElementById('person');
        if (sachet && person) {
            setupDragDrop(sachet, person, infoBox, {
                dataKey: 'isSachet',
                defaultText: sachet.dataset.info || '',
                hideOnDrop: false,
                moveTarget: { left: '18%', top: '70%' },
                successText: '香囊佩戴成功！',
                errorText: '❌ 请拖拽香囊到人物！'
            });
        }

        // ---- 火柴 ----
        var huochai = document.getElementById('huochai');
        var matchTarget = document.getElementById('matchTarget');
        if (huochai && matchTarget) {
            setupDragDrop(huochai, matchTarget, infoBox, {
                dataKey: 'isMatch',
                defaultText: huochai.dataset.info || '安息香典故',
                hideOnDrop: true,
                successText: '火柴点燃成功！',
                errorText: '❌ 请拖拽火柴到火盆！'
            });
        }

        // ---- 沉香 ----
        var chenxiang = document.getElementById('chenxiang');
        var chenxiangTarget = document.getElementById('chenxiangTarget');
        if (chenxiang && chenxiangTarget) {
            setupDragDrop(chenxiang, chenxiangTarget, infoBox, {
                dataKey: 'isChenxiang',
                defaultText: chenxiang.dataset.info || '沉香典故',
                hideOnDrop: true,
                successText: '沉香入炉成功！',
                errorText: '❌ 请拖拽沉香到香炉！'
            });
        }

        // ---- 信息弹窗点击关闭 ----
        infoBox.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.remove('show');
        });

        console.log('✅ 场景交互初始化完成');
    }

    // ============================================================
    // 5. 启动
    // ============================================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initSceneInteractions, 300);
        });
    } else {
        setTimeout(initSceneInteractions, 300);
    }

    // ============================================================
    // 6. 暴露手动重新初始化 API
    // ============================================================
    window.__REINIT_SCENE = function() {
        console.log('🔄 手动重新初始化场景交互...');

        var infoBox = document.getElementById('infoBox');
        if (!infoBox) {
            console.error('❌ #infoBox 不存在');
            return;
        }

        // 重置绑定状态（只重置未投放的）
        var sachet = document.getElementById('sachet');
        var person = document.getElementById('person');
        if (sachet && person && sachet.getAttribute('draggable') !== 'false') {
            delete dragBindings['sachet'];
            setupDragDrop(sachet, person, infoBox, {
                dataKey: 'isSachet',
                defaultText: sachet.dataset.info || '',
                hideOnDrop: false,
                moveTarget: { left: '18%', top: '70%' },
                successText: '香囊佩戴成功！',
                errorText: '❌ 请拖拽香囊到人物！'
            });
        }

        var huochai = document.getElementById('huochai');
        var matchTarget = document.getElementById('matchTarget');
        if (huochai && matchTarget && huochai.style.display !== 'none') {
            delete dragBindings['huochai'];
            setupDragDrop(huochai, matchTarget, infoBox, {
                dataKey: 'isMatch',
                defaultText: huochai.dataset.info || '安息香典故',
                hideOnDrop: true,
                successText: '火柴点燃成功！',
                errorText: '❌ 请拖拽火柴到火盆！'
            });
        }

        var chenxiang = document.getElementById('chenxiang');
        var chenxiangTarget = document.getElementById('chenxiangTarget');
        if (chenxiang && chenxiangTarget && chenxiang.style.display !== 'none') {
            delete dragBindings['chenxiang'];
            setupDragDrop(chenxiang, chenxiangTarget, infoBox, {
                dataKey: 'isChenxiang',
                defaultText: chenxiang.dataset.info || '沉香典故',
                hideOnDrop: true,
                successText: '沉香入炉成功！',
                errorText: '❌ 请拖拽沉香到香炉！'
            });
        }

        console.log('✅ 场景交互重新绑定完成');
    };

    // ============================================================
    // 7. 监听场景页切换
    // ============================================================
    var scenePageIds = ['page-scene1', 'page-scene2', 'page-scene3'];
    var lastActiveScene = null;

    // MutationObserver
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                var target = mutation.target;
                if (target.classList.contains('active')) {
                    var pageId = target.id;
                    if (scenePageIds.indexOf(pageId) !== -1) {
                        console.log('📄 场景页激活:', pageId);
                        setTimeout(function() {
                            if (window.__REINIT_SCENE) {
                                window.__REINIT_SCENE();
                            }
                        }, 500);
                    }
                }
            }
        });
    });

    scenePageIds.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            observer.observe(el, { attributes: true, attributeFilter: ['class'] });
        }
    });

    // 定时器备选方案
    setInterval(function() {
        var active = null;
        for (var i = 0; i < scenePageIds.length; i++) {
            var el = document.getElementById(scenePageIds[i]);
            if (el && el.classList.contains('active')) {
                active = scenePageIds[i];
                break;
            }
        }
        if (active !== lastActiveScene && active !== null) {
            console.log('📄 [Timer] 场景切换:', active);
            lastActiveScene = active;
            setTimeout(function() {
                if (window.__REINIT_SCENE) {
                    window.__REINIT_SCENE();
                }
            }, 500);
        }
    }, 1500);

    console.log('🎬 场景交互模块加载完成');
    console.log('💡 使用 window.__REINIT_SCENE() 可手动重新初始化');
})();


/**
 * ============================================================
 * 天然香料模块（香材介绍 + 古代名香 + 饼图）
 * ============================================================
 */
(function() {
    'use strict';

    // ---- 香材数据（从表格中提取所有香料，每种只介绍一次） ----
    var herbData = [
        { 
            id: 'chenxiang', 
            image: 'images/xiangcai1.png',   // ← 改为图片路径
            name: '沉香', 
            sub: '众香之首',
            desc: '瑞香科植物白木香树含树脂的木材。因树脂含量高、入水即沉而得名。沉香香气清雅悠远，有"众香之首"的美誉，是历代皇家祭祀、文人品香的首选香材。其形成需经数十年甚至上百年的自然结香过程，极为珍贵。在表格收录的20种香方中，沉香出现于鹅梨帐中香、花蕊夫人衙香、婴香、二苏旧局、四和香、李主帐中梅花香、宣和贵妃王氏金香、寿阳公主梅花香、唐开元宫中香、宋宣和御制香、清神香、柏子香、桂花香、玫瑰香、安息香方、沉香熟水香等16个香方中，是使用频率最高的核心香材。'
        },
        { 
            id: 'tanxiang', 
            image: 'images/xiangcai2.png',   // ← 改为图片路径
            name: '檀香', 
            sub: '香中之王',
            desc: '檀香科檀香属植物的心材。木质致密，香气醇厚持久，有"香中之王"的美称。檀香在佛教、印度教中被视为圣木，常用于宗教仪式和冥想修行。其香气能安神静心，是制作高端合香的重要基底。表格中檀香出现于鹅梨帐中香、花蕊夫人衙香、婴香、二苏旧局（老山檀）、汉建宁宫中香、四和香、清远香、李主帐中梅花香、益气香珠、宣和贵妃王氏金香、寿阳公主梅花香、唐开元宫中香、宋宣和御制香、清神香、柏子香、桂花香、玫瑰香、安息香方、沉香熟水香等19个香方中，是仅次于沉香的常用香材。'
        },
        { 
            id: 'ruxiang', 
            image: 'images/xiangcai3.png',   // ← 改为图片路径
            name: '乳香', 
            sub: '圣洁之香',
            desc: '橄榄科乳香树的树脂。香气清甜微苦，有圣洁之感。乳香在三大宗教中都被视为圣香，是最早传入中国的进口香料之一。其香气能提升精神专注力，是修行、冥想场景的理想用香。表格中乳香出现于花蕊夫人衙香、二苏旧局、汉建宁宫中香、避疫香、四和香、唐开元宫中香、宋宣和御制香、清神香、沉香熟水香等9个香方中。'
        },
        { 
            id: 'longnao', 
            image: 'images/xiangcai4.png',   // ← 改为图片路径
            name: '龙脑', 
            sub: '冰片之香',
            desc: '龙脑香树树脂经蒸馏提取的结晶。外观如冰晶，气味清凉辛香，有"冰片"之称。龙脑在古代是极为珍贵的进口香料，常与沉香、檀香搭配使用，能提升香气的穿透力和层次感，也是许多宫廷香方的必备香材。表格中龙脑出现于花蕊夫人衙香、婴香、四和香、清远香（冰片）、李主帐中梅花香、宣和贵妃王氏金香、寿阳公主梅花香、唐开元宫中香、宋宣和御制香、清神香、柏子香、桂花香、玫瑰香、安息香方、沉香熟水香等15个香方中。'
        },
        { 
            id: 'shexiang', 
            image: 'images/xiangcai5.png',   // ← 改为图片路径
            name: '麝香', 
            sub: '动物之香',
            desc: '雄麝香腺的干燥分泌物。香气浓郁持久，有"动物之香"的美誉。麝香在传统香方中常用作"引香"，能增强其他香材的扩散力和持久性。因其稀缺和采集不易，麝香自古就是极为昂贵的香料，常为皇家御用。表格中麝香出现于花蕊夫人衙香、婴香、李主帐中梅花香、宣和贵妃王氏金香、寿阳公主梅花香、宋宣和御制香、清神香等7个宫廷香方中。'
        },
        { 
            id: 'dingxiang', 
            image: 'images/xiangcai6.png',   // ← 改为图片路径
            name: '丁香', 
            sub: '香料之后',
            desc: '桃金娘科丁香树的花蕾。香气辛甜温暖，有"香料之后"的美称。丁香在唐代通过丝绸之路传入中国，迅速成为合香中的重要辅料。其香气能调和各种香材，使整体香韵更加圆润饱满。表格中丁香出现于婴香、李主帐中梅花香、宣和贵妃王氏金香、寿阳公主梅花香等4个香方中。'
        },
        { 
            id: 'zhanxiang', 
            image: 'images/xiangcai7.png',   // ← 改为图片路径
            name: '栈香', 
            sub: '沉香之属',
            desc: '沉香的一种，指含树脂较少、质较轻、入水半浮半沉的香木。栈香与沉香同源，但结香程度较浅，香气清浅淡雅，价格相对亲民，是宋代合香中常用的基础香材。表格中栈香出现于花蕊夫人衙香中，与沉香并列使用。'
        },
        { 
            id: 'jiaxian', 
            image: 'images/xiangcai8.png',   // ← 改为图片路径
            name: '甲香', 
            sub: '螺甲之香',
            desc: '螺类动物的厣（壳口盖片），经炮制后入香。甲香在传统合香中用作"发香"之剂，能延长香气的留香时间，使整体香韵更加持久醇和。是古代合香工艺中的重要辅料。表格中甲香出现于花蕊夫人衙香和婴香中。'
        },
        { 
            id: 'huangshu', 
            image: 'images/xiangcai9.png',   // ← 改为图片路径
            name: '黄熟香', 
            sub: '熟结沉香',
            desc: '沉香的一种，指树木枯死或倒下后，经长时间自然熟化形成的结香。黄熟香色泽偏黄，香气醇厚温和，价格比沉香亲民，是汉代宫廷香方中常用的基础香材。表格中黄熟香出现于汉建宁宫中香中。'
        },
        { 
            id: 'huoxiang', 
            image: 'images/xiangcai10.png',   // ← 改为图片路径
            name: '藿香', 
            sub: '化湿之香',
            desc: '唇形科藿香属植物的地上部分。香气清新辛散，有化湿解暑之效。藿香在传统合香和药香中都有广泛应用，能祛除湿浊之气，净化空间。表格中藿香出现于汉建宁宫中香和避疫香中。'
        },
        { 
            id: 'lingling', 
            image: 'images/xiangcai11.png',   // ← 改为图片路径
            name: '零陵香', 
            sub: '馥郁之草',
            desc: '报春花科珍珠菜属植物，又名灵香草。香气浓郁持久，有馥郁的草本甜香。零陵香在古代合香中是重要的定香剂，能稳定整体香气，使香韵更加协调。表格中零陵香出现于汉建宁宫中香、清远香、李主帐中梅花香、寿阳公主梅花香等4个香方中。'
        },
        { 
            id: 'baizhi', 
            image: 'images/xiangcai12.png',   // ← 改为图片路径
            name: '白芷', 
            sub: '香草之英',
            desc: '伞形科当归属植物的根。香气辛香浓郁，是传统香方中最常用的草本香材之一。白芷有祛风散寒之效，在香方中常与其他草本香材搭配，营造清冽通透的香韵。表格中白芷出现于汉建宁宫中香和避疫香中。'
        },
        { 
            id: 'maoxiang', 
            image: 'images/xiangcai13.png',   // ← 改为图片路径
            name: '茅香', 
            sub: '清野之香',
            desc: '禾本科茅香属植物，香气清甜而有田野之气。茅香在古代合香中常作为基础辅料，为整体香韵增添自然清新的草木气息。表格中茅香出现于汉建宁宫中香和清远香中。'
        },
        { 
            id: 'gansong', 
            image: 'images/xiangcai14.png',   // ← 改为图片路径
            name: '甘松', 
            sub: '甘润之香',
            desc: '败酱科甘松属植物的根茎。香气甘甜温润，有独特的药草香气。甘松在传统合香中常作为"佐使"之材，能调和诸香，增添温润感。表格中甘松出现于汉建宁宫中香、清远香、李主帐中梅花香、寿阳公主梅花香等4个香方中。'
        },
        { 
            id: 'dingxingpi', 
            image: 'images/xiangcai15.png',   // ← 改为图片路径
            name: '丁香皮', 
            sub: '丁香树皮',
            desc: '丁香树的树皮，与丁香花蕾同源而香气不同。丁香皮香气较花蕾更为清冽含蓄，在合香中常作为辅助香材，能增添木质调的清雅气息。表格中丁香皮出现于汉建宁宫中香中。'
        },
        { 
            id: 'cangzhu', 
            image: 'images/xiangcai16.png',   // ← 改为图片路径
            name: '苍术', 
            sub: '避疫之宝',
            desc: '菊科苍术属植物的根茎。香气辛香浓郁，有芳香化浊、避疫驱邪之效。苍术是传统防疫香方的核心药材，在历代疫病流行时期都被广泛使用。表格中苍术出现于避疫香和益气香珠中。'
        },
        { 
            id: 'aiye', 
            image: 'images/xiangcai17.png',   // ← 改为图片路径
            name: '艾叶', 
            sub: '端午之香',
            desc: '菊科蒿属植物的叶片。香气清苦辛香，有温经散寒之效。艾叶是端午节传统的悬挂香草，在传统香方中常用于净化空间、驱除秽气。表格中艾叶出现于避疫香中。'
        },
        { 
            id: 'changpu', 
            image: 'images/xiangcai18.png',   // ← 改为图片路径
            name: '菖蒲', 
            sub: '水畔之香',
            desc: '天南星科菖蒲属植物的根茎。香气清冽辛散，有开窍醒神之效。菖蒲常生于水畔，其香气能提神醒脑、辟秽化浊。表格中菖蒲出现于避疫香中。'
        },
        { 
            id: 'xuanxuan', 
            image: 'images/xiangcai19.png',   // ← 改为图片路径
            name: '玄参', 
            sub: '滋阴之香',
            desc: '玄参科玄参属植物的根。香气清润甘甜，有滋阴降火之效。玄参在合香中能增加香气的润泽感，使整体香韵更加柔和清透。表格中玄参出现于清远香中。'
        },
        // { 
        //     id: 'bingpian', 
        //     emoji: '🧊', 
        //     name: '冰片', 
        //     sub: '龙脑之晶',
        //     desc: '龙脑香的结晶，与龙脑同源。外观如冰片，气味清凉透亮，有开窍醒神之效。冰片在合香中能提升香气的穿透力和清凉感。表格中冰片出现于清远香中。'
        // },
        { 
            id: 'huangqi', 
            image: 'images/xiangcai20.png',   // ← 改为图片路径
            name: '黄芪', 
            sub: '补气之香',
            desc: '豆科黄芪属植物的根。香气清甜温和，有补气固表之效。黄芪是传统药香中的重要香材，兼具养生与闻香的双重功效。表格中黄芪出现于益气香珠中。'
        },
        { 
            id: 'renshen', 
            image: 'images/xiangcai21.png',   // ← 改为图片路径
            name: '人参', 
            sub: '百草之王',
            desc: '五加科人参属植物的根。香气甘润温厚，有大补元气之效。人参是传统养生香方中最珍贵的药材之一，能极大提升香品的养生效用。表格中人参出现于益气香珠中。'
        },
        { 
            id: 'gancao', 
            image: 'images/xiangcai22.png',   // ← 改为图片路径
            name: '甘草', 
            sub: '调和之香',
            desc: '豆科甘草属植物的根茎。香气甘甜温和，有调和诸药之效。甘草在药香合方中常作为"使"药，能中和各种香材的药性，使整体更加协调。表格中甘草出现于益气香珠中。'
        },
        // { 
        //     id: 'zhenla', 
        //     emoji: '🌳', 
        //     name: '真腊沉香', 
        //     sub: '沉水奇楠',
        //     desc: '真腊（今柬埔寨地区）所产的高品质沉香，是沉香中的顶级品种。真腊沉香香气清甜凉透，有独特的蜜香和凉意，是宋代宫廷香方中最为珍视的香材。表格中真腊沉香出现于宣和贵妃王氏金香中。'
        // },
        // { 
        //     id: 'jin_e', 
        //     emoji: '💰', 
        //     name: '金额香', 
        //     sub: '金色之香',
        //     desc: '一种名贵的异域香料，具体来源已不可考，据传为金色树脂类香料。在宋代宫廷香方中，金额香常与沉香、檀香搭配，用以提升香品的华贵感。表格中金额香出现于宣和贵妃王氏金香中。'
        // },
        // { 
        //     id: 'chenshui', 
        //     emoji: '🌳', 
        //     name: '沉水香', 
        //     sub: '沉水之香',
        //     desc: '沉香中品质最高的等级，因含树脂量极高、入水即沉而得名。沉水香香气极为醇厚深邃，是古代香方中最核心的香材。表格中沉水香出现于婴香中。'
        // },
        // { 
        //     id: 'zhijia', 
        //     emoji: '🐚', 
        //     name: '制甲香', 
        //     sub: '炮制螺甲',
        //     desc: '甲香经炮制加工后的成品。炮制可去除甲香的腥气，激发其发香留香的功效。制甲香在传统合香中是重要的"佐使"之材。表格中制甲香出现于婴香中。'
        // },
        { 
            id: 'moli', 
            image: 'images/xiangcai23.png',   // ← 改为图片路径
            name: '茉莉', 
            sub: '花中之韵',
            desc: '木犀科茉莉属植物的花。香气清雅甜润，有"一卉能熏一室香"之美誉。茉莉在文人香方中常作为"使"香，为整体香韵增添清灵的花香气息。表格中茉莉出现于二苏旧局中。'
        },
        { 
            id: 'baihu', 
            image: 'images/xiangcai24.png',   // ← 改为图片路径
            name: '柏子仁', 
            sub: '柏实之香',
            desc: '柏科植物的成熟种仁。香气清润甘甜，有养心安神之效。柏子仁是传统草本香方中的重要香材，香气温润不燥，适合长期熏闻。表格中柏子仁出现于柏子香中。'
        },
        { 
            id: 'guihua', 
            image: 'images/xiangcai25.png',   // ← 改为图片路径
            name: '桂花', 
            sub: '秋香之冠',
            desc: '木犀科木犀属植物的花。香气甜润馥郁，有"独占三秋压众芳"之美誉。桂花是传统花香的典型代表，常与沉香、檀香搭配，营造甜雅香韵。表格中桂花出现于桂花香中。'
        },
        { 
            id: 'meigui', 
            image: 'images/xiangcai26.png',   // ← 改为图片路径
            name: '玫瑰花', 
            sub: '花中之后',
            desc: '蔷薇科蔷薇属植物的花。香气甜润馥郁，有疏肝理气之效。玫瑰花是清代以降最受欢迎的花香香材，香气优雅动人，适合女性使用。表格中玫瑰花出现于玫瑰香中。'
        },
        { 
            id: 'anxi', 
            image: 'images/xiangcai27.png',   // ← 改为图片路径
            name: '安息香', 
            sub: '异域之香',
            desc: '安息香科安息香树的树脂。香气甜润温暖，有开窍醒神之效。安息香是通过丝绸之路传入中国的重要进口香料，在唐代宫廷香方中地位显著。表格中安息香出现于安息香方中。'
        },
        // { 
        //     id: 'laoshan', 
        //     emoji: '🌲', 
        //     name: '老山檀', 
        //     sub: '檀香上品',
        //     desc: '产自印度迈索尔地区的顶级檀香，又称"老山檀香"。老山檀香气醇厚甘甜，留香持久，是檀香中品质最高的品种，常作为文人香方中的"臣"香使用。表格中老山檀出现于二苏旧局中。'
        // },
        { 
            id: 'hupo', 
            image: 'images/xiangcai28.png',   // ← 改为图片路径
            name: '琥珀', 
            sub: '松脂之珀',
            desc: '松柏科植物树脂经千万年地质作用形成的化石。研磨后入香，香气清雅悠远，有安神定志之效。琥珀在文人香方中常作为辅料，为香韵增添温润的树脂气息。表格中琥珀出现于二苏旧局中。'
        }
    ];

    // ---- 古代名香数据（含配比、君臣佐使、功效） ----
    var recipeData = [
        { 
            id: 'eyue', 
            name: '鹅梨帐中香', 
            image: 'images/mingxiang1.png',
            emoji: '🍐',
            dynasty: '宋代',
            source: '《香乘》《陈氏香谱》',
            desc: '经典宫廷甜香，梨汁调香，安神助眠，清甜卧室香。',
            ratio: [
                { name: '沉香', value: 40 },
                { name: '檀香', value: 5 }
            ],
            roles: '君：沉香 40g | 臣：檀香 5g',
            effect: '安神助眠、清甜卧室香'
        },
        { 
            id: 'huarui', 
            name: '花蕊夫人衙香', 
            image: 'images/mingxiang2.png',
            emoji: '🌸',
            dynasty: '五代',
            source: '《香乘》卷十四',
            desc: '宫廷高级合香，华贵清润，层次丰富，读书凝神。',
            ratio: [
                { name: '沉香', value: 15 },
                { name: '栈香', value: 15 },
                { name: '檀香', value: 5 },
                { name: '乳香', value: 5 },
                { name: '甲香', value: 5 },
                { name: '龙脑', value: 0.25 },
                { name: '麝香', value: 0.5 }
            ],
            roles: '君：沉香、栈香 各15g | 臣：檀香 5g | 佐：乳香、甲香 各5g | 使：龙脑、麝香',
            effect: '华贵清润、读书凝神'
        },
        { 
            id: 'yingxiang', 
            name: '婴香', 
            image: 'images/mingxiang3.png',
            emoji: '🧸',
            dynasty: '汉魏',
            source: '《香乘》古香方',
            desc: '经典古方，香气温和不燥，柔和甘润，安身净意。',
            ratio: [
                { name: '沉水香', value: 15 },
                { name: '丁香', value: 2 },
                { name: '檀香', value: 2.5 },
                { name: '制甲香', value: 0.5 },
                { name: '龙脑', value: 3.5 },
                { name: '麝香', value: 1.5 }
            ],
            roles: '君：沉水香 15g | 臣：丁香 2g | 佐：檀香 2.5g、制甲香 0.5g | 使：龙脑、麝香',
            effect: '柔和甘润、安身净意'
        },
        { 
            id: 'erxian', 
            name: '二苏旧局', 
            image: 'images/mingxiang4.png',
            emoji: '📜',
            dynasty: '宋代',
            source: '香文化网·文人香方',
            desc: '苏轼与苏辙兄弟合创的文人名香，清雅脱俗，体现宋代文人闲适雅致的审美追求。',
            ratio: [
                { name: '沉香', value: 20 },
                { name: '老山檀', value: 14 },
                { name: '乳香', value: 6 },
                { name: '琥珀', value: 6 },
                { name: '茉莉', value: 2 }
            ],
            roles: '君：沉香 20g | 臣：老山檀 14g | 佐：乳香、琥珀 各6g | 使：茉莉 2g',
            effect: '清雅文气、减压静思'
        },
        { 
            id: 'hanjianning', 
            name: '汉建宁宫中香', 
            image: 'images/mingxiang5.png',
            emoji: '🏛️',
            dynasty: '汉代',
            source: '《香乘》卷十四',
            desc: '汉代官修宫廷香方，宫廷大气，辟秽扶正。',
            ratio: [
                { name: '黄熟香', value: 40 },
                { name: '檀香', value: 10 },
                { name: '藿香', value: 10 },
                { name: '零陵香', value: 10 },
                { name: '白芷', value: 10 },
                { name: '茅香', value: 5 },
                { name: '甘松', value: 5 },
                { name: '丁香皮', value: 5 },
                { name: '乳香', value: 2 }
            ],
            roles: '君：黄熟香 40g | 臣：檀香、藿香、零陵香 各10g | 佐：白芷 10g、茅香、甘松、丁香皮 各5g | 使：乳香 2g',
            effect: '宫廷大气、辟秽扶正'
        },
        { 
            id: 'biyi', 
            name: '避疫香', 
            image: 'images/mingxiang6.png',
            emoji: '🛡️',
            dynasty: '现代',
            source: '中国香文化研究中心·2020公开方',
            desc: '官方推荐非遗避疫香方，芳香化浊，净化空间。',
            ratio: [
                { name: '苍术', value: 30 },
                { name: '白芷', value: 20 },
                { name: '艾叶', value: 20 },
                { name: '藿香', value: 15 },
                { name: '菖蒲', value: 10 },
                { name: '乳香', value: 5 }
            ],
            roles: '君：苍术 30g | 臣：白芷、艾叶 各20g | 佐：藿香 15g、菖蒲 10g | 使：乳香 5g',
            effect: '芳香化浊、避疫净化'
        },
        { 
            id: 'sihe', 
            name: '四和香', 
            image: 'images/mingxiang7.png',
            emoji: '☯️',
            dynasty: '通用',
            source: '香文化网·配伍示范方',
            desc: '经典合香配伍模板，层次分明，和合诸香。',
            ratio: [
                { name: '沉香', value: 50 },
                { name: '檀香', value: 25 },
                { name: '乳香', value: 15 },
                { name: '龙脑', value: 10 }
            ],
            roles: '君：沉香 50g | 臣：檀香 25g | 佐：乳香 15g | 使：龙脑 10g',
            effect: '层次分明、和合诸香'
        },
        { 
            id: 'qingyuan', 
            name: '清远香', 
            image: 'images/mingxiang8.png',
            emoji: '🌿',
            dynasty: '宋代',
            source: '《陈氏香谱》',
            desc: '夏季专属清润香方，清幽解暑，除烦疏肝。',
            ratio: [
                { name: '甘松', value: 30 },
                { name: '零陵香', value: 20 },
                { name: '茅香', value: 20 },
                { name: '玄参', value: 15 },
                { name: '檀香', value: 10 },
                { name: '冰片', value: 5 }
            ],
            roles: '君：甘松 30g | 臣：零陵香、茅香 各20g | 佐：玄参 15g、檀香 10g | 使：冰片 5g',
            effect: '清幽解暑、除烦疏肝'
        },
        { 
            id: 'lizhu', 
            name: '李主帐中梅花香', 
            image: 'images/mingxiang9.png',
            emoji: '🌺',
            dynasty: '南唐',
            source: '《香乘》',
            desc: '南唐宫廷清雅香方，梅香冷韵，帐中清寂。',
            ratio: [
                { name: '沉香', value: 5 },
                { name: '丁香', value: 5 },
                { name: '檀香', value: 2.5 },
                { name: '甘松', value: 2.5 },
                { name: '零陵香', value: 2.5 },
                { name: '龙脑', value: 1.3 },
                { name: '麝香', value: 0.2 }
            ],
            roles: '君：沉香、丁香 各5g | 臣：檀香 2.5g | 佐：甘松、零陵香 各2.5g | 使：龙脑、麝香',
            effect: '梅香冷韵、帐中清寂'
        },
        { 
            id: 'yiqi', 
            name: '益气香珠', 
            image: 'images/mingxiang10.png',
            emoji: '💊',
            dynasty: '通用',
            source: '《香乘·益气香珠》、香文化网养生方',
            desc: '药香养生香方，补气健脾，安神固表，可做香珠或线香。',
            ratio: [
                { name: '黄芪', value: 40 },
                { name: '人参', value: 20 },
                { name: '苍术', value: 15 },
                { name: '檀香', value: 15 },
                { name: '甘草', value: 10 }
            ],
            roles: '君：黄芪 40g | 臣：人参 20g | 佐：苍术、檀香 各15g | 使：甘草 10g',
            effect: '补气健脾、安神固表'
        },
        { 
            id: 'xuanheguifei', 
            name: '宣和贵妃王氏金香', 
            image: 'images/mingxiang11.png',
            emoji: '👑',
            dynasty: '宋代',
            source: '《香乘》卷十四',
            desc: '宋代宫廷高级合香，贵妃专属配方，华贵清雅，安神定志。',
            ratio: [
                { name: '真腊沉香', value: 8 },
                { name: '檀香', value: 2 },
                { name: '丁香', value: 0.5 },
                { name: '金额香', value: 0.5 },
                { name: '麝香', value: 1 },
                { name: '龙脑', value: 4 }
            ],
            roles: '君：真腊沉香 8g | 臣：檀香 2g | 佐：丁香、金额香 各0.5g | 使：麝香 1g、龙脑 4g',
            effect: '华贵清雅、安神定志'
        },
        { 
            id: 'shouyang', 
            name: '寿阳公主梅花香', 
            image: 'images/mingxiang12.png',
            emoji: '🌺',
            dynasty: '南朝',
            source: '《香乘》',
            desc: '南朝寿阳公主专属梅花香方，经典冷韵香，梅香清雅，辟秽醒神。',
            ratio: [
                { name: '沉香', value: 5 },
                { name: '丁香', value: 5 },
                { name: '檀香', value: 2.5 },
                { name: '甘松', value: 2.5 },
                { name: '零陵香', value: 2.5 },
                { name: '龙脑', value: 1.3 },
                { name: '麝香', value: 0.2 }
            ],
            roles: '君：沉香、丁香 各5g | 臣：檀香 2.5g | 佐：甘松、零陵香 各2.5g | 使：龙脑、麝香',
            effect: '梅香清雅、辟秽醒神'
        },
        { 
            id: 'tangkaiyuan', 
            name: '唐开元宫中香', 
            image: 'images/mingxiang13.png',
            emoji: '🏯',
            dynasty: '唐代',
            source: '《香乘》',
            desc: '唐代开元年间宫廷御用香方，大气磅礴，辟秽扶正，尽显盛唐气象。',
            ratio: [
                { name: '沉香', value: 30 },
                { name: '檀香', value: 15 },
                { name: '乳香', value: 10 },
                { name: '龙脑', value: 5 }
            ],
            roles: '君：沉香 30g | 臣：檀香 15g | 佐：乳香 10g | 使：龙脑 5g',
            effect: '大气磅礴、辟秽扶正'
        },
        { 
            id: 'songxuanhe', 
            name: '宋宣和御制香', 
            image: 'images/mingxiang14.png',
            emoji: '📜',
            dynasty: '宋代',
            source: '《香乘》',
            desc: '宋代宣和年间皇帝御制香方，清雅温润，层次丰富，安神助眠。',
            ratio: [
                { name: '沉香', value: 20 },
                { name: '檀香', value: 10 },
                { name: '乳香', value: 10 },
                { name: '龙脑', value: 5 },
                { name: '麝香', value: 5 }
            ],
            roles: '君：沉香 20g | 臣：檀香 10g | 佐：乳香 10g | 使：龙脑、麝香 各5g',
            effect: '清雅温润、安神助眠'
        },
        { 
            id: 'qingshen', 
            name: '清神香', 
            image: 'images/mingxiang15.png',
            emoji: '🧠',
            dynasty: '宋代',
            source: '《陈氏香谱》',
            desc: '宋代经典清神香方，清神醒脑，开窍明目，适合读书办公使用。',
            ratio: [
                { name: '沉香', value: 15 },
                { name: '檀香', value: 10 },
                { name: '乳香', value: 5 },
                { name: '龙脑', value: 5 },
                { name: '麝香', value: 5 }
            ],
            roles: '君：沉香 15g | 臣：檀香 10g | 佐：乳香 5g | 使：龙脑、麝香 各5g',
            effect: '清神醒脑、开窍明目'
        },
        { 
            id: 'baizi', 
            name: '柏子香', 
            image: 'images/mingxiang16.png',
            emoji: '🌲',
            dynasty: '通用',
            source: '《香乘》',
            desc: '经典草本香方，柏子仁为主，清心安神，润肺止咳，温润不燥。',
            ratio: [
                { name: '柏子仁', value: 30 },
                { name: '沉香', value: 10 },
                { name: '檀香', value: 5 },
                { name: '龙脑', value: 5 }
            ],
            roles: '君：柏子仁 30g | 臣：沉香 10g | 佐：檀香 5g | 使：龙脑 5g',
            effect: '清心安神、润肺止咳'
        },
        { 
            id: 'guihua', 
            name: '桂花香', 
            image: 'images/mingxiang17.png',
            emoji: '🌼',
            dynasty: '宋代',
            source: '《香乘》',
            desc: '宋代经典桂花香方，甜香清雅，解郁醒神，还原桂花自然香气。',
            ratio: [
                { name: '桂花', value: 30 },
                { name: '沉香', value: 15 },
                { name: '檀香', value: 10 },
                { name: '龙脑', value: 5 }
            ],
            roles: '君：桂花 30g | 臣：沉香 15g | 佐：檀香 10g | 使：龙脑 5g',
            effect: '甜香清雅、解郁醒神'
        },
        { 
            id: 'meigui', 
            name: '玫瑰香', 
            image: 'images/mingxiang18.png',
            emoji: '🌹',
            dynasty: '清代',
            source: '《香乘》',
            desc: '清代经典玫瑰香方，甜润馥郁，疏肝理气，适合女性使用。',
            ratio: [
                { name: '玫瑰花', value: 30 },
                { name: '沉香', value: 15 },
                { name: '檀香', value: 10 },
                { name: '龙脑', value: 5 }
            ],
            roles: '君：玫瑰花 30g | 臣：沉香 15g | 佐：檀香 10g | 使：龙脑 5g',
            effect: '甜润馥郁、疏肝理气'
        },
        { 
            id: 'anxi', 
            name: '安息香方', 
            image: 'images/mingxiang19.png',
            emoji: '🕯️',
            dynasty: '唐代',
            source: '《香乘》',
            desc: '唐代经典安息香方，异域香料融合，开窍醒神，行气活血。',
            ratio: [
                { name: '安息香', value: 30 },
                { name: '沉香', value: 15 },
                { name: '檀香', value: 10 },
                { name: '龙脑', value: 5 }
            ],
            roles: '君：安息香 30g | 臣：沉香 15g | 佐：檀香 10g | 使：龙脑 5g',
            effect: '开窍醒神、行气活血'
        },
        { 
            id: 'chenxiangshushui', 
            name: '沉香熟水香', 
            image: 'images/mingxiang20.png',
            emoji: '🍵',
            dynasty: '宋代',
            source: '《陈氏香谱》',
            desc: '宋代经典沉香熟水香方，温润醇厚，安神助眠，适合日常熏香。',
            ratio: [
                { name: '沉香', value: 30 },
                { name: '檀香', value: 10 },
                { name: '乳香', value: 5 },
                { name: '龙脑', value: 5 }
            ],
            roles: '君：沉香 30g | 臣：檀香 10g | 佐：乳香 5g | 使：龙脑 5g',
            effect: '温润醇厚、安神助眠'
        }
    ];

    // ---- 颜色调色板（高区分度） ----
    var colorPalette = [
        '#e74c3c',  // 红色
        '#3498db',  // 蓝色
        '#2ecc71',  // 绿色
        '#f1c40f',  // 黄色
        '#9b59b6',  // 紫色
        '#e67e22',  // 橙色
        '#1abc9c',  // 青色
        '#e91e63',  // 粉红
        '#00bcd4',  // 亮青
        '#4caf50',  // 草绿
        '#ff5722',  // 朱红
        '#3f51b5'   // 靛蓝
    ];

    function getColor(index) {
        return colorPalette[index % colorPalette.length];
    }

        // ============================================================
    // 饼图弹窗功能
    // ============================================================

    function createPieModal() {
        var existingModal = document.getElementById('pieModalOverlay');
        if (existingModal) return existingModal;

        var overlay = document.createElement('div');
        overlay.id = 'pieModalOverlay';
        overlay.className = 'pie-modal-overlay';
        overlay.innerHTML = `
            <div class="pie-modal-container">
                <div class="pie-modal-content">
                    <button class="pie-modal-close" id="pieModalClose">✕</button>
                    <div class="pie-modal-title" id="pieModalTitle">香方配比</div>
                    <div class="pie-modal-chart" id="pieModalChart"></div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        var closeBtn = document.getElementById('pieModalClose');
        closeBtn.addEventListener('click', closePieModal);
        overlay.addEventListener('click', function(e) {
            if (e.target === this) closePieModal();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closePieModal();
        });

        return overlay;
    }

    function openPieModal(recipe) {
        var overlay = createPieModal();
        var titleEl = document.getElementById('pieModalTitle');
        var chartEl = document.getElementById('pieModalChart');
        
        if (!titleEl || !chartEl) return;
        
        titleEl.textContent = recipe.emoji + ' ' + recipe.name + ' · 配比图';
        chartEl.innerHTML = '';
        
        renderPieChart(recipe.ratio, chartEl, true);
        
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePieModal() {
        var overlay = document.getElementById('pieModalOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ============================================================
    // 饼图渲染函数（唯一版本，支持大小模式）
    // ============================================================

    function renderPieChart(ratioData, container, isLarge) {
        if (!ratioData || ratioData.length === 0) {
            container.innerHTML = '<div class="pie-empty">暂无配比数据</div>';
            return;
        }

        var total = ratioData.reduce(function(sum, item) { return sum + item.value; }, 0);
        var colors = ratioData.map(function(_, i) { return getColor(i); });

        var viewSize = isLarge ? 200 : 100;
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 ' + viewSize + ' ' + viewSize);
        svg.style.width = '100%';
        svg.style.height = '100%';
        
        if (!isLarge) {
            svg.style.animation = 'pieAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
            svg.style.transformOrigin = 'center';
            svg.style.opacity = '0';
            svg.style.transform = 'scale(0.6)';
        }

        var cx = viewSize / 2, cy = viewSize / 2;
        var r = isLarge ? 55 : 42;
        // ---- 从 12 点钟方向开始 ----
        var startAngle = -Math.PI / 2;

        var slices = [];

        ratioData.forEach(function(item, index) {
            var percent = item.value / total;
            var endAngle = startAngle + percent * 2 * Math.PI;

            var x1 = cx + r * Math.cos(startAngle);
            var y1 = cy + r * Math.sin(startAngle);
            var x2 = cx + r * Math.cos(endAngle);
            var y2 = cy + r * Math.sin(endAngle);

            var largeArc = percent > 0.5 ? 1 : 0;

            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            var d = [
                'M', cx, cy,
                'L', x1, y1,
                'A', r, r, 0, largeArc, 1, x2, y2,
                'Z'
            ].join(' ');
            path.setAttribute('d', d);
            path.setAttribute('fill', colors[index]);
            path.setAttribute('stroke', 'rgba(30,21,16,0.6)');
            path.setAttribute('stroke-width', isLarge ? '1.2' : '0.6');
            path.setAttribute('data-index', index);
            
            if (!isLarge) {
                path.style.opacity = '0';
                path.style.animation = 'sliceReveal 0.5s ease forwards';
                path.style.animationDelay = (0.05 + index * 0.12) + 's';
            }
            svg.appendChild(path);

            var midAngle = startAngle + (endAngle - startAngle) / 2;
            slices.push({
                item: item,
                percent: percent,
                midAngle: midAngle,
                color: colors[index],
                index: index
            });

            startAngle = endAngle;
        });

        // ---- 大图模式：标注文字 ----
        if (isLarge) {
            var sortedSlices = slices.slice().sort(function(a, b) {
                return b.percent - a.percent;
            });

            sortedSlices.forEach(function(slice, idx) {
                var percent = slice.percent;
                var midAngle = slice.midAngle;
                var item = slice.item;
                var color = slice.color;

                var isLeft = midAngle > Math.PI / 2 && midAngle < Math.PI * 1.5;
                
                var labelR = r * 1.35;
                var labelX = cx + labelR * Math.cos(midAngle);
                var labelY = cy + labelR * Math.sin(midAngle);

                var innerR = r * 0.85;
                var innerX = cx + innerR * Math.cos(midAngle);
                var innerY = cy + innerR * Math.sin(midAngle);

                var outerR = r * 1.3;
                var outerX = cx + outerR * Math.cos(midAngle);
                var outerY = cy + outerR * Math.sin(midAngle);

                // 引线
                var line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                var lineD = ['M', innerX, innerY, 'L', outerX, outerY].join(' ');
                line.setAttribute('d', lineD);
                line.setAttribute('stroke', 'rgba(200,180,160,0.5)');
                line.setAttribute('stroke-width', '0.8');
                line.setAttribute('fill', 'none');
                line.setAttribute('stroke-dasharray', '2,2');
                line.style.opacity = '0';
                line.style.animation = 'labelReveal 0.4s ease forwards';
                line.style.animationDelay = (0.1 + idx * 0.08) + 's';
                svg.appendChild(line);

                var shortName = item.name;
                var percentText = (percent * 100).toFixed(1) + '%';
                var labelText = shortName + ' ' + percentText;

                var textAnchor = isLeft ? 'end' : 'start';
                var offsetX = isLeft ? -6 : 6;

                var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', labelX + offsetX);
                text.setAttribute('y', labelY + 4);
                text.setAttribute('text-anchor', textAnchor);
                text.setAttribute('dominant-baseline', 'middle');
                text.setAttribute('fill', '#f0e6d8');
                text.setAttribute('font-size', '7');
                text.setAttribute('font-weight', '600');
                text.setAttribute('font-family', 'Georgia, serif');
                text.textContent = labelText;
                text.style.opacity = '0';
                text.style.animation = 'labelReveal 0.4s ease forwards';
                text.style.animationDelay = (0.15 + idx * 0.08) + 's';
                svg.appendChild(text);

                var dotR = 4;
                var dotX = isLeft ? labelX - 2 : labelX + 2;
                var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                dot.setAttribute('cx', dotX);
                dot.setAttribute('cy', labelY);
                dot.setAttribute('r', dotR);
                dot.setAttribute('fill', color);
                dot.setAttribute('stroke', 'rgba(30,21,16,0.4)');
                dot.setAttribute('stroke-width', '0.5');
                dot.style.opacity = '0';
                dot.style.animation = 'labelReveal 0.4s ease forwards';
                dot.style.animationDelay = (0.15 + idx * 0.08) + 's';
                svg.appendChild(dot);
            });

            // 中间圆
            var circleR = 0;
            var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', cx);
            circle.setAttribute('cy', cy);
            circle.setAttribute('r', circleR);
            circle.setAttribute('fill', 'rgba(30,21,16,0.85)');
            circle.setAttribute('stroke', 'rgba(184,148,92,0.2)');
            circle.setAttribute('stroke-width', '1');
            circle.style.opacity = '0';
            circle.style.animation = 'labelReveal 0.5s ease forwards';
            circle.style.animationDelay = (0.1 + slices.length * 0.08) + 's';
            svg.appendChild(circle);

            var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', cx);
            text.setAttribute('y', cy + 4);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', '#c9a87c');
            text.setAttribute('font-size', '16');
            text.setAttribute('font-weight', '700');
            text.setAttribute('font-family', 'Georgia, serif');
            // text.textContent = '配比图';
            text.style.opacity = '0';
            text.style.animation = 'labelReveal 0.5s ease forwards';
            text.style.animationDelay = (0.1 + slices.length * 0.08) + 's';
            svg.appendChild(text);

        } else {
            // ---- 小图模式：饼图 + 中间"配比"文字 ----
            var circleR = 0;
            var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', cx);
            circle.setAttribute('cy', cy);
            circle.setAttribute('r', circleR);
            circle.setAttribute('fill', 'rgba(30,21,16,0.85)');
            circle.setAttribute('stroke', 'rgba(184,148,92,0.2)');
            circle.setAttribute('stroke-width', '0.5');
            circle.style.opacity = '0';
            circle.style.animation = 'labelReveal 0.5s ease forwards';
            circle.style.animationDelay = (0.1 + slices.length * 0.1) + 's';
            svg.appendChild(circle);

            var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', cx);
            text.setAttribute('y', cy + 3);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', '#c9a87c');
            text.setAttribute('font-size', '10');
            text.setAttribute('font-weight', '700');
            text.setAttribute('font-family', 'Georgia, serif');
            // text.textContent = '配比';
            text.style.opacity = '0';
            text.style.animation = 'labelReveal 0.5s ease forwards';
            text.style.animationDelay = (0.1 + slices.length * 0.1) + 's';
            svg.appendChild(text);
        }

        container.innerHTML = '';
        container.appendChild(svg);

      // ---- 小图模式：饼图 + 右侧图例 ----
if (!isLarge) {
    // 创建 flex 容器，让饼图和图例水平排列
    var wrapperDiv = document.createElement('div');
    wrapperDiv.style.display = 'flex';
    wrapperDiv.style.alignItems = 'center';
    wrapperDiv.style.gap = '16px';
    wrapperDiv.style.justifyContent = 'flex-start';  // ← 靠左对齐
    
    // 饼图 SVG 放入 wrapper
    svg.style.width = '140px';
    svg.style.height = '140px';
    wrapperDiv.appendChild(svg);
    
    // 创建图例
    var legendContainer = document.createElement('div');
    legendContainer.className = 'pie-legend';
    legendContainer.style.display = 'flex';
    legendContainer.style.flexDirection = 'column';
    legendContainer.style.gap = '6px';
    
    ratioData.forEach(function(item, index) {
        var percent = ((item.value / total) * 100).toFixed(1);
        var itemDiv = document.createElement('div');
        itemDiv.className = 'pie-legend-item';
        itemDiv.style.display = 'flex';
        itemDiv.style.alignItems = 'center';
        itemDiv.style.gap = '8px';
        itemDiv.style.fontSize = '0.75rem';
        itemDiv.style.color = 'rgba(240, 230, 216, 0.8)';
        itemDiv.style.whiteSpace = 'nowrap';
        
        itemDiv.innerHTML = [
            '<span class="color-dot" style="background:' + colors[index] + '; width:10px; height:10px; border-radius:50%; flex-shrink:0; border:1px solid rgba(255,255,255,0.1);"></span>',
            '<span class="label-text" style="font-size:0.75rem;">' + item.name + '</span>',
            '<span class="percent-text" style="color:var(--gold); font-weight:600; font-size:0.7rem; min-width:36px; text-align:right;">' + percent + '%</span>'
        ].join('');
        legendContainer.appendChild(itemDiv);
    });
    
    wrapperDiv.appendChild(legendContainer);
    container.innerHTML = '';
    container.appendChild(wrapperDiv);
}
    }

    // ============================================================
    // DOM 引用和状态
    // ============================================================

    var panelContent = document.getElementById('panelContent');
    var scrollTrack = document.getElementById('spicesScrollTrack');
    var scrollWrapper = document.getElementById('spicesScrollWrapper');
    var tabs = document.querySelectorAll('.spices-tab');
    var btnExpand = document.getElementById('btnExpand');

    var currentTab = 'herb';
    var selectedHerbId = 'chenxiang';
    var selectedRecipeId = 'eyue';
    var isExpanded = false;





/**
 * 滚动到页面顶部（展示面板区域）
 */
function scrollToTop() {
    var page = document.getElementById('page-spices');
    if (!page) return;
    
    page.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}






    // ============================================================
    // 渲染函数
    // ============================================================

    function renderPanel() {
        if (currentTab === 'herb') {
        var herb = herbData.find(function(h) { return h.id === selectedHerbId; });
        if (!herb) return;

        // ★★★ 使用 flex 布局，图片在左，文字在右 ★★★
        panelContent.innerHTML = [
            '<div class="panel-herb-layout">',
            '    <div class="panel-herb-image-wrapper">',
            '        <img class="panel-herb-image" src="' + herb.image + '" alt="' + herb.name + '" />',
            '    </div>',
            '    <div class="panel-herb-info">',
            '        <div class="panel-title">' + herb.name + '</div>',
            '        <div class="panel-sub">' + herb.sub + '</div>',
            '        <div class="panel-desc">' + herb.desc + '</div>',
            '    </div>',
            '</div>'
        ].join('');
    }  else {
            var recipe = recipeData.find(function(r) { return r.id === selectedRecipeId; });
            if (!recipe) return;

            var wrapper = document.createElement('div');
            wrapper.className = 'recipe-layout';

            var leftDiv = document.createElement('div');
            leftDiv.className = 'recipe-left';
            leftDiv.innerHTML = [
                '<div class="panel-title">' + recipe.name + '</div>',
                '<div class="panel-sub">' + recipe.dynasty + ' · ' + recipe.source + '</div>',
                '<div class="panel-desc" style="margin-bottom:4px;">📋 ' + recipe.roles + '</div>',
                '<div class="panel-desc" style="font-size:0.85rem;color:var(--gold);">✨ ' + recipe.effect + '</div>'
            ].join('');

            var rightDiv = document.createElement('div');
            rightDiv.className = 'recipe-right';

            var chartDiv = document.createElement('div');
            chartDiv.className = 'pie-chart-container';
            chartDiv.style.cursor = 'pointer';
            chartDiv.title = '点击放大查看';
            chartDiv.innerHTML = '';

            // 传入 false 表示小图模式
            renderPieChart(recipe.ratio, chartDiv, false);
            rightDiv.appendChild(chartDiv);

            // ---- 点击饼图弹出放大 ----
            chartDiv.addEventListener('click', function() {
                openPieModal(recipe);
            });

            wrapper.appendChild(leftDiv);
            wrapper.appendChild(rightDiv);
            panelContent.innerHTML = '';
            panelContent.appendChild(wrapper);
        }
    }
function renderScrollTrack() {
    scrollTrack.innerHTML = '';

    if (currentTab === 'herb') {
        herbData.forEach(function(herb) {
            var card = document.createElement('div');
            card.className = 'spice-mini-card';
            card.dataset.id = herb.id;
            
            if (herb.id === selectedHerbId) {
                card.classList.add('active');
            }
            
            card.innerHTML = [
                '<img class="herb-image" src="' + herb.image + '" alt="' + herb.name + '" />',
                '<div class="name">' + herb.name + '</div>',
                '<div class="sub">' + herb.sub + '</div>'
            ].join('');
            
            card.addEventListener('click', function() {
                selectedHerbId = this.dataset.id;
                renderScrollTrack();
                renderPanel();
                
                // ⭐ 滚动到页面顶部
                scrollToTop();
            });
            
            scrollTrack.appendChild(card);
        });
    } else {
    recipeData.forEach(function(recipe) {
        var card = document.createElement('div');
        card.className = 'spice-mini-card';
        card.dataset.id = recipe.id;
        
        if (recipe.id === selectedRecipeId) {
            card.classList.add('active');
        }
        
        // ★★★ 将 emoji 改为 image ★★★
        card.innerHTML = [
            '<img class="herb-image" src="' + recipe.image + '" alt="' + recipe.name + '" />',
            '<div class="name">' + recipe.name + '</div>',
            '<div class="sub">' + recipe.dynasty + ' · ' + recipe.ratio.length + '味</div>'
        ].join('');
        
        card.addEventListener('click', function() {
            selectedRecipeId = this.dataset.id;
            renderScrollTrack();
            renderPanel();
            scrollToTop();
        });
        
        scrollTrack.appendChild(card);
    });
}
}

    // ============================================================
    // 展开/收起功能
    // ============================================================

    function toggleExpand() {
        isExpanded = !isExpanded;
        
        var spicesPage = document.getElementById('page-spices');
        
        if (btnExpand) {
            btnExpand.classList.toggle('active', isExpanded);
            var textSpan = btnExpand.querySelector('.btn-expand-text');
            if (textSpan) {
                textSpan.textContent = isExpanded ? '收起' : '展开全部';
            }
        }
        
        if (scrollWrapper) {
            scrollWrapper.classList.toggle('expanded', isExpanded);
            
            if (isExpanded) {
                if (spicesPage) {
                    spicesPage.classList.add('scrollable');
                }
            } else {
                if (spicesPage) {
                    spicesPage.classList.remove('scrollable');
                }
            }
        }
    }

    // ============================================================
    // Tab 切换
    // ============================================================

    function switchTab(tab) {
        currentTab = tab;
        tabs.forEach(function(t) {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        
        if (isExpanded) {
            isExpanded = false;
            if (btnExpand) {
                btnExpand.classList.remove('active');
                var textSpan = btnExpand.querySelector('.btn-expand-text');
                if (textSpan) textSpan.textContent = '展开全部';
            }
            if (scrollWrapper) {
                scrollWrapper.classList.remove('expanded');
            }
            var spicesPage = document.getElementById('page-spices');
            if (spicesPage) {
                spicesPage.classList.remove('scrollable');
            }
        }
        
        if (tab === 'herb') {
            selectedHerbId = herbData[0]?.id || 'chenxiang';
        } else {
            selectedRecipeId = recipeData[0]?.id || 'eyue';
        }
        renderScrollTrack();
        renderPanel();
    }

    // ============================================================
    // 事件绑定
    // ============================================================

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var tabName = this.dataset.tab;
            if (tabName !== currentTab) {
                switchTab(tabName);
            }
        });
    });

    function bindWheelScroll() {
        var wrapper = document.querySelector('.spices-scroll-wrapper');
        if (wrapper) {
            if (wrapper._wheelHandler) {
                wrapper.removeEventListener('wheel', wrapper._wheelHandler);
            }
            wrapper._wheelHandler = function(e) {
                e.preventDefault();
                this.scrollLeft += e.deltaY;
            };
            wrapper.addEventListener('wheel', wrapper._wheelHandler, { passive: false });
        }
    }

    // ============================================================
    // 初始化
    // ============================================================

    function initSpices() {
        if (herbData.length > 0) selectedHerbId = herbData[0].id;
        if (recipeData.length > 0) selectedRecipeId = recipeData[0].id;
        renderScrollTrack();
        renderPanel();
        bindWheelScroll();

        if (btnExpand) {
            btnExpand.addEventListener('click', toggleExpand);
        }

        var spicesPage = document.getElementById('page-spices');
        if (spicesPage) {
            spicesPage.classList.remove('scrollable');
        }

        console.log('✅ 天然香料模块初始化完成，共加载 ' + herbData.length + ' 种香材，' + recipeData.length + ' 种名香');
    }

    // ---- 页面切换时重新绑定滚轮事件 ----
    var spicesPage = document.getElementById('page-spices');
    if (spicesPage) {
        var pageObserver = new MutationObserver(function() {
            if (spicesPage.classList.contains('active')) {
                bindWheelScroll();
                renderScrollTrack();
                renderPanel();
            }
        });
        pageObserver.observe(spicesPage, { attributes: true, attributeFilter: ['class'] });
    }

    // 暴露 API
    window.__SPICES = {
        switchTab: switchTab,
        renderPanel: renderPanel,
        renderScrollTrack: renderScrollTrack,
        herbData: herbData,
        recipeData: recipeData
    };

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSpices);
    } else {
        initSpices();
    }

})();








/**
 * 滚动到展示面板位置
 */
function scrollToPanel() {
    var panel = document.querySelector('.spices-panel');
    var page = document.getElementById('page-spices');
    
    if (!panel || !page) return;
    
    // 如果页面未展开，先自动展开
    if (!isExpanded) {
        // 自动展开，然后等待动画完成后滚动
        toggleExpand();
        // 延迟执行滚动，等待展开动画
        setTimeout(function() {
            doScrollToPanel(panel, page);
        }, 450);
    } else {
        doScrollToPanel(panel, page);
    }
}

/**
 * 实际执行滚动
 */
function doScrollToPanel(panel, page) {
    var panelRect = panel.getBoundingClientRect();
    var pageRect = page.getBoundingClientRect();
    
    // 计算面板在页面内的相对位置，留 20px 顶部边距
    var scrollTarget = panelRect.top - pageRect.top + page.scrollTop - 20;
    
    page.scrollTo({
        top: Math.max(0, scrollTarget),
        behavior: 'smooth'
    });
}









/**
 * ============================================================
 * 制香工序 · 长图滚动模块（道具放大版）
 * ============================================================
 */

(function() {
    'use strict';

    // ---- 工序数据 ----
    var STEPS = [{
        id: 'select',
        name: '选料',
        sub: '甄选天然香材',
        desc: '精选优质天然香材，<em>沉香、檀香、龙脑</em>等，依古法标准，辨其形、闻其气、察其色，去伪存真，为制香之本。',
        layout: 'left',
        draw: drawSelect
    }, {
        id: 'process',
        name: '炮制',
        sub: '修制·炒制·炙制',
        desc: '依香材特性，<em>修制、炒制、炙制</em>，去其燥性，取其精华。炮制乃合香之魂，火候、时间皆有定数。',
        layout: 'right',
        draw: drawProcess
    }, {
        id: 'grind',
        name: '研磨',
        sub: '细研成粉',
        desc: '将炮制后的香材<em>研磨成粉</em>，细度决定香气释放的均匀度。古法以石臼、石磨，今以细筛，务求细腻。',
        layout: 'left',
        draw: drawGrind
    }, {
        id: 'blend',
        name: '合香',
        sub: '君臣佐使 · 和合众香',
        desc: '依古法香方，<em>君臣佐使</em>配伍，调和诸香。沉香为君，檀香为臣，乳香为佐，龙脑为使，比例精微。',
        layout: 'right',
        draw: drawBlend
    }, {
        id: 'form',
        name: '制香',
        sub: '线香 · 盘香 · 香丸',
        desc: '将合好的香粉，以<em>水、蜜、榆皮</em>为粘合，制成线香、盘香、塔香、香丸等形态，各具其韵。',
        layout: 'left',
        draw: drawForm
    }, {
        id: 'dry',
        name: '阴干',
        sub: '避光 · 通风 · 自然干燥',
        desc: '制好的香品置于<em>阴凉通风处</em>，避光自然阴干。不可暴晒，不可急火，静待时日，香韵渐成。',
        layout: 'right',
        draw: drawDry
    }, {
        id: 'store',
        name: '窖藏',
        sub: '时光沉淀 · 香韵愈醇',
        desc: '将阴干后的香品入<em>陶瓮、锡罐</em>，封存窖藏。岁月流转，香气交融、醇化，愈久弥香。',
        layout: 'right',
        draw: drawStore
    }];

    // ---- 辅助：放大系数 ----
    var S = 1.5; // 道具整体放大系数

    // ============================================================
    // 绘制函数（每帧循环动画，道具放大版）
    // ============================================================

    // 1. 选料：放大镜扫过所有材料
    function drawSelect(ctx, w, h, t) {
        var cx = w / 2, cy = h / 2 + 20;

        // 桌面（放大）
        ctx.fillStyle = '#4a3228';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.fillRect(cx - 120 * S, cy + 30, 240 * S, 14 * S);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#3a2218';
        ctx.fillRect(cx - 110 * S, cy + 44, 10 * S, 50 * S);
        ctx.fillRect(cx + 100 * S, cy + 44, 10 * S, 50 * S);

        // 材料列表（放大）
        var herbs = [
            { x: cx - 70 * S, y: cy + 12, color: '#7a5c3e', good: true, name: '沉香' },
            { x: cx - 30 * S, y: cy + 6, color: '#8a6c4e', good: true, name: '檀香' },
            { x: cx + 15 * S, y: cy + 10, color: '#6a4c2e', good: false, name: '杂木' },
            { x: cx + 55 * S, y: cy + 8, color: '#9a7c5e', good: true, name: '龙脑' },
            { x: cx + 95 * S, y: cy + 14, color: '#5a3f2b', good: false, name: '朽木' }
        ];

        // 放大镜位置
        var angle = t * 0.35;
        var lx = cx + 10 + 80 * S * Math.cos(angle);
        var ly = cy - 4 + 45 * S * Math.sin(angle);

        // 绘制材料（放大）
        herbs.forEach(function(h) {
            var pulse = 1 + 0.08 * Math.sin(t * 0.6 + h.x * 0.1);
            ctx.fillStyle = h.color;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(h.x, h.y, 16 * S * pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,200,0.08)';
            ctx.beginPath();
            ctx.arc(h.x - 3 * S, h.y - 4 * S, 7 * S * pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(200,180,160,0.25)';
            ctx.font = (11 * S) + 'px serif';
            ctx.textAlign = 'center';
            ctx.fillText(h.name, h.x, h.y + 32 * S);
        });

        // 放大镜（放大）
        ctx.strokeStyle = 'rgba(184,148,92,0.8)';
        ctx.lineWidth = 3 * S;
        ctx.beginPath();
        ctx.arc(lx, ly, 32 * S, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lx + 28 * S, ly + 24 * S);
        ctx.lineTo(lx + 50 * S, ly + 42 * S);
        ctx.stroke();
        ctx.shadowColor = 'rgba(184,148,92,0.2)';
        ctx.shadowBlur = 40;
        ctx.fillStyle = 'rgba(184,148,92,0.04)';
        ctx.beginPath();
        ctx.arc(lx, ly, 38 * S, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 高亮检测
        herbs.forEach(function(h) {
            var dist = Math.hypot(lx - h.x, ly - h.y);
            if (dist < 32 * S) {
                if (h.good) {
                    var glow = 0.4 + 0.4 * Math.sin(t * 3);
                    ctx.shadowColor = 'rgba(255,215,120,0.8)';
                    ctx.shadowBlur = 50;
                    ctx.fillStyle = 'rgba(255,215,120,' + glow * 0.25 + ')';
                    ctx.beginPath();
                    ctx.arc(h.x, h.y, 24 * S + 6 * S * Math.sin(t * 2.5), 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.strokeStyle = 'rgba(255,215,120,' + (0.5 + 0.3 * Math.sin(t * 2.5)) + ')';
                    ctx.lineWidth = 3 * S;
                    ctx.beginPath();
                    ctx.arc(h.x, h.y, 18 * S, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
                    ctx.fillStyle = 'rgba(60,50,40,0.35)';
                    ctx.beginPath();
                    ctx.arc(h.x, h.y, 20 * S, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(80,70,60,0.3)';
                    ctx.lineWidth = 2 * S;
                    ctx.beginPath();
                    ctx.arc(h.x, h.y, 17 * S, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        });

        ctx.fillStyle = 'rgba(184,148,92,0.8)';
        ctx.font = (16 * S) + 'px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔍 选料 · 辨材', cx, h - 24);
    }

        // 2. 炮制：火堆+大锅，材料沸腾（火焰下移）
    function drawProcess(ctx, w, h, t) {
        var cx = w / 2, cy = h / 2 + 20;

        ctx.fillStyle = 'rgba(60,42,30,0.2)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 120, 180 * S, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // ---- 柴火堆（先画，在火焰下方） ----
        for (var i = 0; i < 14; i++) {
            var fx = cx - 40 * S + i * 10 * S + Math.sin(i * 1.2) * 6 * S;
            var fy = cy + 50 + Math.cos(i * 0.7) * 8 * S;
            ctx.fillStyle = '#3a2a1a';
            ctx.shadowBlur = 8;
            ctx.fillRect(fx, fy, 6 * S + Math.sin(i) * 3 * S, 12 * S + Math.cos(i * 0.5) * 6 * S);
        }
        ctx.shadowBlur = 0;

        // ---- 火焰（下移，更靠近柴火） ----
        for (var j = 0; j < 14; j++) {
            // 火焰Y轴整体下移：从 cy+10 改为 cy+16
            var fx2 = cx - 30 * S + j * 8 * S + Math.sin(t * 2.5 + j * 1.2) * 8 * S;
            var fy2 = cy + 40 - Math.sin(t * 1.8 + j * 0.9) * 24 * S - 4 * S;
            var r = 10 * S + Math.sin(t * 2.2 + j * 0.7) * 6 * S + 3 * S;
            var alpha = 0.2 + 0.2 * Math.sin(t * 2 + j * 0.5);
            ctx.fillStyle = 'rgba(255,160,60,' + alpha + ')';
            ctx.beginPath();
            ctx.arc(fx2, fy2, r, 0, Math.PI * 2);
            ctx.fill();
            // 内焰
            ctx.fillStyle = 'rgba(255,220,120,' + alpha * 0.5 + ')';
            ctx.beginPath();
            ctx.arc(fx2 - 3 * S, fy2 - 4 * S, r * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // ---- 大锅 ----
        ctx.fillStyle = '#2a1a12';
        ctx.shadowBlur = 16;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.ellipse(cx - 2, cy + 10, 80 * S, 28 * S, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a0e08';
        ctx.beginPath();
        ctx.ellipse(cx - 2, cy + 6, 68 * S, 22 * S, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#4a3228';
        ctx.lineWidth = 3 * S;
        ctx.beginPath();
        ctx.ellipse(cx - 2, cy + 10, 80 * S, 28 * S, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx - 2, cy + 6, 68 * S, 22 * S, 0, 0, Math.PI * 2);
        ctx.stroke();

        // ---- 锅中材料 ----
        for (var k = 0; k < 26; k++) {
            var angle2 = t * 1.2 + k * 0.5;
            var ax = cx - 42 * S + k * 6 * S + Math.sin(angle2) * 8 * S;
            var ay = cy + 4 + Math.sin(t * 1.6 + k * 0.5) * 8 * S + 2;
            var size = 5 * S + Math.sin(t + k) * 2 * S;
            if (ax > cx - 60 * S && ax < cx + 56 * S && ay > cy - 2 && ay < cy + 20 * S) {
                ctx.fillStyle = '#7a5c3e';
                ctx.beginPath();
                ctx.arc(ax, ay, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'rgba(200,170,130,0.15)';
                ctx.beginPath();
                ctx.arc(ax - 2 * S, ay - 2 * S, size * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // ---- 气泡 ----
        for (var b = 0; b < 12; b++) {
            var bx = cx - 40 * S + b * 12 * S + Math.sin(t * 1.3 + b) * 8 * S;
            var by = cy + 2 - Math.sin(t * 2.2 + b * 0.6) * 10 * S;
            var br = 3 * S + Math.sin(t * 1.7 + b) * 2 * S;
            ctx.fillStyle = 'rgba(200,220,240,' + (0.05 + 0.05 * Math.sin(t * 1.5 + b)) + ')';
            ctx.beginPath();
            ctx.arc(bx, by, br, 0, Math.PI * 2);
            ctx.fill();
        }

        // ---- 雾气（升腾） ----
        for (var s = 0; s < 8; s++) {
            var sx = cx - 30 * S + s * 14 * S + Math.sin(t * 0.6 + s * 0.4) * 10 * S;
            var sy = cy - 12 * S - s * 18 * S - 10 * S * Math.sin(t * 0.8 + s * 0.3);
            var sr = 26 * S + Math.sin(t * 0.5 + s) * 10 * S;
            var grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
            grad.addColorStop(0, 'rgba(255,220,190,' + (0.04 + 0.05 * Math.sin(t * 0.6 + s * 0.3)) + ')');
            grad.addColorStop(1, 'rgba(255,220,190,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fill();
        }

        // ---- 锅铲 ----
        var stir = Math.sin(t * 1.2) * 0.35;
        ctx.strokeStyle = '#8a7a6a';
        ctx.lineWidth = 4 * S;
        ctx.beginPath();
        ctx.moveTo(cx + 56 * S + stir * 14 * S, cy - 28 * S + stir * 16 * S);
        ctx.quadraticCurveTo(cx + 34 * S + stir * 8 * S, cy - 18 * S + stir * 10 * S, cx + 22 * S + stir * 4 * S, cy - 10 * S + stir * 4 * S);
        ctx.stroke();
        ctx.fillStyle = '#6a5a4a';
        ctx.shadowBlur = 6;
        ctx.fillRect(cx + 16 * S + stir * 8 * S, cy - 14 * S + stir * 4 * S, 20 * S, 12 * S);
        ctx.shadowBlur = 0;

        // ---- 底部文字 ----
        ctx.fillStyle = 'rgba(184,148,92,0.8)';
        ctx.font = (16 * S) + 'px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔥 炮制 · 沸腾', cx, h - 24);
    }

    // 3. 研磨：大石臼
    function drawGrind(ctx, w, h, t) {
        var cx = w / 2, cy = h / 2 + 20;

        ctx.fillStyle = 'rgba(60,42,30,0.2)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 120, 160 * S, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // 大石臼（放大）
        ctx.fillStyle = '#5a4a3a';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.ellipse(cx - 4, cy + 22, 84 * S, 36 * S, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4a3a2a';
        ctx.beginPath();
        ctx.ellipse(cx - 4, cy + 16, 68 * S, 26 * S, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 粉末（放大）
        for (var i = 0; i < 60; i++) {
            var px = cx - 48 * S + i * 3 * S + Math.sin(t * 0.4 + i * 0.5) * 5 * S;
            var py = cy + 10 + Math.sin(t * 0.6 + i * 0.3) * 4 * S;
            var ps = 2.5 * S + Math.sin(t * 0.3 + i) * 1.2 * S;
            if (px > cx - 56 * S && px < cx + 48 * S && py > cy + 4 && py < cy + 30 * S) {
                ctx.fillStyle = '#8a7a5a';
                ctx.beginPath();
                ctx.arc(px, py, ps, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 石杵（放大）
        var pound = Math.sin(t * 1.6) * 0.4;
        ctx.fillStyle = '#6a5a4a';
        ctx.shadowBlur = 8;
        ctx.fillRect(cx + 40 * S, cy - 26 * S + pound * 22 * S, 12 * S, 52 * S - pound * 16 * S);
        ctx.fillStyle = '#5a4a3a';
        ctx.beginPath();
        ctx.ellipse(cx + 46 * S, cy - 28 * S + pound * 22 * S, 14 * S, 8 * S, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 粉末飞溅（放大）
        for (var j = 0; j < 20; j++) {
            var fx = cx - 28 * S + Math.sin(t * 1.2 + j * 1.6) * 48 * S;
            var fy = cy - 8 * S + Math.cos(t * 1.5 + j * 1.3) * 30 * S;
            if (fx > cx - 60 * S && fx < cx + 52 * S && fy > cy - 12 * S && fy < cy + 26 * S) {
                ctx.fillStyle = 'rgba(180,160,120,' + (0.04 + 0.05 * Math.sin(t * 0.7 + j)) + ')';
                ctx.beginPath();
                ctx.arc(fx, fy, 3 * S + Math.sin(t * 0.4 + j) * 2 * S, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.fillStyle = 'rgba(184,148,92,0.8)';
        ctx.font = (16 * S) + 'px serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚙️ 研磨 · 细粉', cx, h - 24);
    }

    // 4. 合香：材料倒入容器
    function drawBlend(ctx, w, h, t) {
        var cx = w / 2, cy = h / 2 + 20;

        ctx.fillStyle = 'rgba(60,42,30,0.2)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 120, 160 * S, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // 工作台（放大）
        ctx.fillStyle = '#4a3228';
        ctx.shadowBlur = 10;
        ctx.fillRect(cx - 140 * S, cy + 28, 280 * S, 14 * S);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#3a2218';
        ctx.fillRect(cx - 130 * S, cy + 42, 10 * S, 50 * S);
        ctx.fillRect(cx + 120 * S, cy + 42, 10 * S, 50 * S);

        // 大合香碗（放大）
        ctx.fillStyle = '#2a1a12';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(cx - 2, cy + 16, 56 * S, 22 * S, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3a2a1a';
        ctx.beginPath();
        ctx.ellipse(cx - 2, cy + 12, 44 * S, 16 * S, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 多种材料倒入（放大）
        var colors = ['#7a5c3e', '#8a6c4e', '#6a4c2e', '#9a7c5e', '#b8945c', '#5a3f2b'];
        for (var i = 0; i < 22; i++) {
            var angle = t * 0.45 + i * 0.4;
            var rx = cx - 36 * S + 50 * S * Math.sin(angle);
            var ry = cy - 22 * S + 32 * S * Math.cos(angle * 0.6);
            var col = colors[i % colors.length];
            var alpha = 0.15 + 0.2 * Math.sin(t * 0.5 + i * 0.3);
            ctx.fillStyle = col;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(rx, ry, 6 * S + Math.sin(t * 0.6 + i) * 3 * S, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // 搅拌棒（放大）
        var rot = t * 0.8;
        ctx.strokeStyle = '#6a5a4a';
        ctx.lineWidth = 4 * S;
        ctx.beginPath();
        ctx.moveTo(cx + 34 * S + 16 * S * Math.sin(rot), cy - 10 * S + 14 * S * Math.cos(rot));
        ctx.lineTo(cx + 6 * S + 20 * S * Math.sin(rot + 1.0), cy + 18 * S + 8 * S * Math.cos(rot + 1.0));
        ctx.stroke();
        ctx.strokeStyle = '#7a6a5a';
        ctx.beginPath();
        ctx.moveTo(cx + 42 * S + 14 * S * Math.sin(rot + 0.6), cy - 12 * S + 16 * S * Math.cos(rot + 0.6));
        ctx.lineTo(cx + 22 * S + 22 * S * Math.sin(rot + 0.8), cy + 16 * S + 12 * S * Math.cos(rot + 0.8));
        ctx.stroke();

        // ctx.fillStyle = 'rgba(184,148,92,0.8)';
        // ctx.font = (14 * S) + 'px serif';
        ctx.textAlign = 'center';
        // ctx.fillText('君臣佐使 · 和合', cx, h - 24);
        ctx.fillStyle = 'rgba(184,148,92,0.8)';
        ctx.font = (16 * S) + 'px serif';
        ctx.fillText('⚗️ 合香 · 均匀', cx, h - 24);
    }

        // 5. 制香：香粉加水和泥，制成各种香（原始大小）
    function drawForm(ctx, w, h, t) {
        var cx = w / 2, cy = h / 2 + 20;

        ctx.fillStyle = 'rgba(60,42,30,0.2)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 120, 160, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // ---- 工作台 ----
        ctx.fillStyle = '#4a3228';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.fillRect(cx - 120, cy + 28, 240, 12);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#3a2218';
        ctx.fillRect(cx - 110, cy + 40, 8, 40);
        ctx.fillRect(cx + 102, cy + 40, 8, 40);

        // ---- 桌面上的香粉堆（左侧，正在制作） ----
        ctx.fillStyle = '#8a6c4e';
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.arc(cx - 60, cy + 16, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(200,180,150,0.1)';
        ctx.beginPath();
        ctx.arc(cx - 64, cy + 12, 8, 0, Math.PI * 2);
        ctx.fill();

        // ---- 水滴（加水） ----
        for (var w2 = 0; w2 < 5; w2++) {
            var dx = cx - 72 + w2 * 14 + Math.sin(t * 0.6 + w2) * 5;
            var dy = cy - 2 + Math.sin(t * 1.0 + w2 * 0.4) * 8;
            var alpha = 0.08 + 0.08 * Math.sin(t * 0.7 + w2);
            var size = 3 + Math.sin(t * 0.4 + w2) * 1.2;
            ctx.fillStyle = 'rgba(100,180,255,' + alpha + ')';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(dx, dy, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,' + (alpha * 0.3) + ')';
            ctx.beginPath();
            ctx.arc(dx - size * 0.3, dy - size * 0.3, size * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }

        // ---- 【成品展示：完整摆在桌子上】 ----

        // 1. 线香（6根，整齐排列）
        for (var j = 0; j < 6; j++) {
            var lx = cx - 18 + j * 16;
            var ly = cy + 14;
            ctx.fillStyle = '#7a5c3e';
            ctx.shadowBlur = 3;
            ctx.shadowColor = 'rgba(0,0,0,0.15)';
            ctx.fillRect(lx, ly, 2.5, 22);
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#5a3f2b';
            ctx.beginPath();
            ctx.arc(lx + 1.25, ly, 3.5, 0, Math.PI * 2);
            ctx.fill();
            if (j % 2 === 0) {
                var glow = 0.2 + 0.15 * Math.sin(t * 1.5 + j);
                ctx.fillStyle = 'rgba(255,80,40,' + glow + ')';
                ctx.beginPath();
                ctx.arc(lx + 1.25, ly, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 2. 盘香（螺旋形）
        ctx.strokeStyle = '#7a5c3e';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        var centerX = cx + 68;
        var centerY = cy + 14;
        for (var r = 5; r < 28; r += 3.5) {
            var a = r * 0.6 + t * 0.03;
            var px = centerX + r * Math.cos(a);
            var py = centerY + r * Math.sin(a) * 0.5;
            if (r === 5) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#5a3f2b';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 3. 香丸（4颗）
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        for (var k = 0; k < 4; k++) {
            var bx = cx + 6 + k * 20;
            var by = cy + 16;
            ctx.fillStyle = '#6a4c2e';
            ctx.beginPath();
            ctx.arc(bx, by, 6 + Math.sin(t * 0.3 + k) * 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(200,170,130,0.15)';
            ctx.beginPath();
            ctx.arc(bx - 2, by - 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // 4. 塔香
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.fillStyle = '#6a4c2e';
        ctx.beginPath();
        ctx.moveTo(cx + 104, cy + 4);
        ctx.lineTo(cx + 94, cy + 22);
        ctx.lineTo(cx + 114, cy + 22);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(90,70,50,0.1)';
        ctx.lineWidth = 1;
        for (var t2 = 0; t2 < 2; t2++) {
            var ty = cy + 8 + t2 * 6;
            var tw = (ty - (cy + 4)) / 18 * 20;
            ctx.beginPath();
            ctx.moveTo(cx + 104 - tw/2, ty);
            ctx.lineTo(cx + 104 + tw/2, ty);
            ctx.stroke();
        }
        var tipGlow = 0.15 + 0.1 * Math.sin(t * 1.2);
        ctx.fillStyle = 'rgba(255,100,50,' + tipGlow + ')';
        ctx.beginPath();
        ctx.arc(cx + 104, cy + 4, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 5. 香饼（2块）
        ctx.shadowBlur = 3;
        ctx.shadowColor = 'rgba(0,0,0,0.12)';
        for (var p = 0; p < 2; p++) {
            var px2 = cx - 82 + p * 28;
            var py2 = cy + 18;
            ctx.fillStyle = '#7a5c3e';
            ctx.beginPath();
            ctx.ellipse(px2, py2, 7, 4.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(90,70,50,0.08)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(px2, py2, 4.5, 2.5, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        // ---- 底部文字 ----
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(184,148,92,0.8)';
       ctx.font = (16 * S) + 'px serif';
        ctx.textAlign = 'center';
        ctx.fillText('✋ 制香 · 成香', cx, h - 24);
    }

        // 6. 阴干：晾物架，微风拂动（原始大小）
    function drawDry(ctx, w, h, t) {
        var cx = w / 2, cy = h / 2 + 20;

        ctx.fillStyle = 'rgba(60,42,30,0.2)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 120, 150, 25, 0, 0, Math.PI * 2);
        ctx.fill();

        // ---- 晾香架 ----
        ctx.fillStyle = '#4a3228';
        ctx.shadowBlur = 6;
        ctx.fillRect(cx - 100, cy + 10, 200, 5);
        ctx.fillRect(cx - 100, cy + 32, 200, 5);
        ctx.fillRect(cx - 100, cy + 54, 200, 5);
        ctx.fillRect(cx - 100, cy + 6, 5, 54);
        ctx.fillRect(cx + 95, cy + 6, 5, 54);
        ctx.shadowBlur = 0;

        // ---- 悬挂线香（微风拂动） ----
        for (var row = 0; row < 3; row++) {
            for (var i = 0; i < 6; i++) {
                var swing = Math.sin(t * 0.4 + row * 0.6 + i * 0.5) * 6;
                var lx = cx - 75 + i * 26 + swing;
                var ly = cy + 10 + row * 22 + Math.sin(t * 0.5 + row * 0.8 + i * 0.3) * 3;
                var color = row === 0 ? '#7a5c3e' : (row === 1 ? '#8a6c4e' : '#6a4c2e');
                ctx.fillStyle = color;
                ctx.fillRect(lx, ly + 2, 2.5, 18);
                ctx.fillStyle = '#5a3f2b';
                ctx.beginPath();
                ctx.arc(lx + 1.2, ly + 2, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // ---- 风纹（微风拂动） ----
        for (var j = 0; j < 5; j++) {
            var alpha = 0.02 + 0.03 * Math.sin(t * 0.4 + j);
            ctx.strokeStyle = 'rgba(184,148,92,' + alpha + ')';
            ctx.lineWidth = 1.2;
            var offset = Math.sin(t * 0.5 + j) * 10;
            ctx.beginPath();
            ctx.moveTo(cx - 90 + j * 28 + offset, cy - 6 + j * 12);
            ctx.lineTo(cx - 40 + j * 28 + Math.sin(t * 0.6 + j + 0.5) * 12, cy - 16 + j * 10);
            ctx.stroke();
        }

        // ---- 底部文字 ----
        ctx.fillStyle = 'rgba(184,148,92,0.8)';
        ctx.font = (16 * S) + 'px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🌬️ 阴干 · 通风', cx, h - 24);
    }

        // 7. 窖藏：从瓮罐内部向外看，盖子从左往右封上后保持不动（原始大小）
    function drawStore(ctx, w, h, t) {
       var cx = w / 2, cy = h / 2 + 20;

    // ---- 瓮罐内部环境（背景） ----
    var gradInner = ctx.createRadialGradient(cx, cy, 10, cx, cy, w * 0.6);
    gradInner.addColorStop(0, '#2a1a12');
    gradInner.addColorStop(0.5, '#1a0e08');
    gradInner.addColorStop(1, '#0a0503');
    ctx.fillStyle = gradInner;
    ctx.fillRect(0, 0, w, h);

    // ---- 罐口 ----
    // ★★★ 循环动画：关闭 10 秒，停留 2 秒 ★★★
    var cycleDuration = 12;   // 总周期 12 秒
    var closeDuration = 10;   // 关闭动作 10 秒
    var rawProgress = (t % cycleDuration) / cycleDuration;
    // 前 10 秒完成关闭，后 2 秒保持关闭状态
    var coverProgress = Math.min(rawProgress * cycleDuration / closeDuration, 1);

    var radiusX = 70 + 6 * Math.sin(t * 0.05);
    var radiusY = 58 + 5 * Math.sin(t * 0.05 + 0.5);

        // ---- 从罐口看到的外面景象 ----
        var gradOutside = ctx.createRadialGradient(
            cx - 12 + 6 * Math.sin(t * 0.02),
            cy - 18 + 6 * Math.cos(t * 0.025),
            20,
            cx, cy, radiusX * 1.2
        );
        gradOutside.addColorStop(0, 'rgba(255,200,150,0.3)');
        gradOutside.addColorStop(0.3, 'rgba(200,160,110,0.2)');
        gradOutside.addColorStop(0.7, 'rgba(100,70,50,0.08)');
        gradOutside.addColorStop(1, 'rgba(20,15,10,0)');

        // ---- 先画盖子（在洞口下一层） ----
        var lidOffsetX = -radiusX + coverProgress * radiusX;
        var lidRX = radiusX;
        var lidRY = radiusY;

        var lidBrightness = 0.55 + 0.45 * (1 - coverProgress);
        var r2 = Math.round(80 * lidBrightness);
        var g2 = Math.round(65 * lidBrightness);
        var b2 = Math.round(45 * lidBrightness);

        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgb(' + r2 + ',' + g2 + ',' + b2 + ')';
        ctx.beginPath();
        ctx.ellipse(cx + lidOffsetX, cy, lidRX, lidRY, 0, 0, Math.PI * 2);
        ctx.fill();

        // 盖子木纹
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(50,40,30,' + (0.08 + 0.08 * (1 - coverProgress)) + ')';
        ctx.lineWidth = 0.8;
        for (var g = 0; g < 5; g++) {
            var gy2 = cy - lidRY * 0.5 + g * lidRY * 0.25;
            ctx.beginPath();
            ctx.ellipse(cx + lidOffsetX + Math.sin(g + t * 0.05) * 4, gy2, lidRX * 0.25, lidRY * 0.08, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        // 密封布/绳
        ctx.strokeStyle = 'rgba(100,80,60,' + (0.05 + 0.15 * coverProgress) + ')';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.ellipse(cx + lidOffsetX, cy, lidRX * 0.92, lidRY * 0.92, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // 擦拭效果
        if (coverProgress > 0.1 && coverProgress < 0.9) {
            var wipeAlpha = 0.03 + 0.04 * (1 - Math.abs(coverProgress - 0.5) * 2);
            ctx.fillStyle = 'rgba(180,150,110,' + wipeAlpha + ')';
            ctx.beginPath();
            ctx.ellipse(cx + lidOffsetX - radiusX * 0.5, cy, radiusX * 0.3, radiusY * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // ---- 外面光景（洞口区域） ----
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.clip();

        ctx.fillStyle = gradOutside;
        ctx.fillRect(cx - radiusX, cy - radiusY, radiusX * 2, radiusY * 2);

        // 烛光
        for (var f = 0; f < 2; f++) {
            var fx = cx - 25 + f * 50 + Math.sin(t * 0.3 + f * 1.2) * 8;
            var fy = cy - 15 + Math.cos(t * 0.4 + f * 0.8) * 10;
            var fr = 5 + Math.sin(t * 0.5 + f) * 2;
            var fa = 0.05 + 0.04 * Math.sin(t * 0.6 + f * 0.5);
            ctx.fillStyle = 'rgba(255,180,100,' + fa + ')';
            ctx.beginPath();
            ctx.arc(fx, fy, fr, 0, Math.PI * 2);
            ctx.fill();
        }

        // 烟雾
        for (var s = 0; s < 3; s++) {
            var sx = cx - 30 + s * 30 + Math.sin(t * 0.2 + s * 0.7) * 12;
            var sy = cy - 25 + s * 8 + Math.sin(t * 0.25 + s * 0.5) * 10;
            var sr = 12 + Math.sin(t * 0.15 + s) * 5;
            ctx.fillStyle = 'rgba(200,180,160,' + (0.02 + 0.02 * Math.sin(t * 0.2 + s)) + ')';
            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fill();
        }

        // 香尘
        for (var d = 0; d < 12; d++) {
            var dx = cx - radiusX * 0.7 + Math.random() * radiusX * 1.4;
            var dy = cy - radiusY * 0.7 + Math.random() * radiusY * 1.4;
            var ds = 1 + Math.random() * 1.5;
            ctx.fillStyle = 'rgba(255,220,180,' + (0.03 + 0.04 * Math.random()) + ')';
            ctx.beginPath();
            ctx.arc(dx, dy, ds, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        // ---- 罐口边缘 ----
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#4a3a2a';
        ctx.beginPath();
        ctx.ellipse(cx, cy, radiusX + 14, radiusY + 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3a2a1a';
        ctx.beginPath();
        ctx.ellipse(cx, cy, radiusX + 7, radiusY + 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        var gradRim = ctx.createRadialGradient(cx, cy, radiusX * 0.6, cx, cy, radiusX + 2);
        gradRim.addColorStop(0, 'rgba(20,12,8,0)');
        gradRim.addColorStop(0.5, 'rgba(20,12,8,0)');
        gradRim.addColorStop(1, 'rgba(10,6,4,0.7)');
        ctx.fillStyle = gradRim;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radiusX + 2, radiusY + 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(120,90,70,0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx - 5, cy - 4, radiusX - 8, radiusY - 6, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 罐壁纹理
        ctx.strokeStyle = 'rgba(60,45,35,0.06)';
        ctx.lineWidth = 0.8;
        for (var w2 = 0; w2 < 6; w2++) {
            var angle = w2 / 6 * Math.PI * 2 + t * 0.01;
            var startR = radiusX * 0.85;
            var endR = radiusX + 10;
            ctx.beginPath();
            ctx.moveTo(cx + startR * Math.cos(angle), cy + startR * 0.8 * Math.sin(angle));
            ctx.lineTo(cx + endR * Math.cos(angle), cy + endR * 0.8 * Math.sin(angle));
            ctx.stroke();
        }

        // ---- 变黑 ----
        var darkAlpha = coverProgress * 0.55;
        ctx.fillStyle = 'rgba(0,0,0,' + darkAlpha + ')';
        ctx.fillRect(0, 0, w, h);

        // ---- 微光 ----
        if (coverProgress > 0.7) {
            var afterGlow = (coverProgress - 0.7) / 0.3;
            for (var p = 0; p < 6; p++) {
                var px2 = cx - 40 + Math.sin(t * 0.15 + p * 1.5) * 55;
                var py2 = cy - 25 + Math.cos(t * 0.12 + p * 1.2) * 40;
                ctx.fillStyle = 'rgba(184,148,92,' + (0.005 + 0.008 * (1 - afterGlow)) + ')';
                ctx.beginPath();
                ctx.arc(px2, py2, 1 + Math.sin(t * 0.2 + p) * 0.6, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // ---- 文字 ----
       ctx.fillStyle = 'rgba(184,148,92,0.8)';
        ctx.font = (16 * S) + 'px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏺 窖藏 · 封存', cx, h - 24);

        if (coverProgress >= 1) {
            ctx.fillStyle = 'rgba(248,163,143,0.5)';
            ctx.font = '18px serif';
            ctx.textAlign = 'center';
            ctx.fillText('▪ 已封存 ▪', cx, cy + 62);
        }
    }

    // ---- 渲染与动画控制 ----
    var container = document.getElementById('processScrollContainer');
    var progress = document.getElementById('processProgress');
    var animId = null;
    var startTime = 0;

    function buildSteps() {
    if (!container) return;
    container.innerHTML = '';
    progress.innerHTML = '';

    // 7个小人各自的位置配置（每个工序不同）
    var charConfigs = [
        { top: '-210px', right: '30px', rotate: '0deg', width: '250px' },     // 工序1：选料
        { bottom: '0px', right: '-50px', rotate: '0deg', width: '230px' },  // 工序2：炮制
        { bottom: '-40px', left: '50px', rotate: '0deg', width: '230px' }, // 工序3：研磨
        { top: '-250px', right: '-30px', rotate: '0deg', width: '250px' },     // 工序4：合香
        { top: '-200px', right: '-60px', rotate: '0deg', width: '230px' },     // 工序5：制香
        { bottom: '-10px', left: '0px', rotate: '0deg', width: '250px' },  // 工序6：阴干
        { top: '-120px', left: '55%', rotate: '0deg', width: '350px' }         // 工序7：窖藏
    ];

    STEPS.forEach(function(step, index) {
        var dot = document.createElement('div');
        dot.className = 'dot';
        dot.dataset.index = index;
        dot.addEventListener('click', function() {
            var target = document.querySelector('.process-step[data-index="' + index + '"]');
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        progress.appendChild(dot);
        if (index < STEPS.length - 1) {
            var line = document.createElement('div');
            line.className = 'line';
            progress.appendChild(line);
        }

        var div = document.createElement('div');
        div.className = 'process-step layout-' + step.layout;
        div.dataset.index = index;

        var info = document.createElement('div');
        info.className = 'info-area';
        
        // ★★★ 关键修改：每个工序只用1个小人，图片编号为 1-7 ★★★
        var charNum = index + 1; // 1, 2, 3, 4, 5, 6, 7
        var config = charConfigs[index];
        
        // 构建定位样式
        var posStyle = '';
        if (config.top) posStyle += 'top:' + config.top + ';';
        if (config.bottom) posStyle += 'bottom:' + config.bottom + ';';
        if (config.left) posStyle += 'left:' + config.left + ';';
        if (config.right) posStyle += 'right:' + config.right + ';';
        // left: 50% 需要配合 transform: translateX(-50%)
        if (config.left === '50%') {
            posStyle += 'left:50%;transform:translateX(-50%) rotate(' + config.rotate + ');';
        } else {
            posStyle += 'transform:rotate(' + config.rotate + ');';
        }
        posStyle += 'width:' + config.width + ';';

        info.innerHTML = 
            // ★ 只有1个小人，图片路径为 images/xiaoren1.png ~ xiaoren7.png
            '<div class="info-character">' +
                '<img src="images/ren' + charNum + '.png" class="char char-' + charNum + '" alt="小人' + charNum + '" style="' + posStyle + '">' +
            '</div>' +
            '<div class="step-number">' + String(index + 1).padStart(2, '0') + ' / ' + STEPS.length +
            '</div>' +
            '<div class="step-name">' + step.name + '</div>' +
            '<div class="step-sub">' + step.sub + '</div>' +
            '<div class="step-desc">' + step.desc + '</div>';
        div.appendChild(info);

        var scene = document.createElement('div');
        scene.className = 'scene-area';
        var canvas = document.createElement('canvas');
        canvas.width = 420;
        canvas.height = 420;
        scene.appendChild(canvas);
        div.appendChild(scene);
        container.appendChild(div);

        div._draw = step.draw;
        div._canvas = canvas;
        div._ctx = canvas.getContext('2d');
    });

    setupObserver();
}

    function setupObserver() {
        var steps = document.querySelectorAll('.process-step');
        var dots = document.querySelectorAll('.process-progress .dot');

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var index = parseInt(entry.target.dataset.index);
                    entry.target.classList.add('visible');
                    dots.forEach(function(dot, i) {
                        dot.classList.toggle('active', i === index);
                    });
                }
            });
        }, {
            threshold: 0.35,
            rootMargin: '0px 0px -20% 0px'
        });

        steps.forEach(function(step) { observer.observe(step); });

        setTimeout(function() {
            steps.forEach(function(step) {
                var rect = step.getBoundingClientRect();
                var winH = window.innerHeight;
                if (rect.top < winH * 0.7 && rect.bottom > 0) {
                    step.classList.add('visible');
                }
            });
        }, 200);

        var resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                steps.forEach(function(step) {
                    var rect = step.getBoundingClientRect();
                    var winH = window.innerHeight;
                    if (rect.top < winH * 0.7 && rect.bottom > 0) {
                        step.classList.add('visible');
                    }
                });
            }, 200);
        });
    }

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = (timestamp - startTime) / 1000;
        var steps = document.querySelectorAll('.process-step');
        steps.forEach(function(step) {
            var ctx = step._ctx;
            var canvas = step._canvas;
            if (ctx && canvas && step._draw) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                step._draw(ctx, canvas.width, canvas.height, elapsed);
            }
        });
        animId = requestAnimationFrame(animate);
    }

    function initProcessPage() {
        if (container && container.children.length === 0) {
            buildSteps();
        }
        if (animId) cancelAnimationFrame(animId);
        startTime = 0;
        animId = requestAnimationFrame(animate);
    }

    var processPage = document.getElementById('page-process');
    if (processPage) {
        var pageObserver = new MutationObserver(function() {
            if (processPage.classList.contains('active')) {
                setTimeout(initProcessPage, 200);
            }
        });
        pageObserver.observe(processPage, { attributes: true, attributeFilter: ['class'] });

        if (processPage.classList.contains('active')) {
            setTimeout(initProcessPage, 300);
        } else {
            setTimeout(initProcessPage, 500);
        }
    }

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (animId) cancelAnimationFrame(animId);
        } else {
            startTime = 0;
            if (animId) cancelAnimationFrame(animId);
            animId = requestAnimationFrame(animate);
        }
    });

    window.__PROCESS = {
        renderSteps: buildSteps,
        init: initProcessPage,
        STEPS: STEPS
    };

    console.log('🔄 制香工序模块加载完成（道具放大版 S=' + S + '）');
})();










/**
 * ============================================================
 * 非遗传承 · 二级页面交互模块
 * ============================================================
 */

(function() {
    'use strict';

    // ==========================================================
    // 数据
    // ==========================================================
    var inheritorData = [
    {
        name: '黄欧',
        title: '国家级非遗传承人 · 莞香制作技艺',
        avatar: 'images/renwu1.png.',
        desc: '1968年生于东莞，自幼跟随姑婆黄寿章习得全套莞香种植、结香、采香、古法和合技艺，完整传承岭南贡香古法。九十年代起寻访保护300余株百年野生莞香母树，创办200亩莞香科普种植园与莞香文化博物馆。独创饥饿结香、辨土育苗古法，复原数十款明清宫廷莞香古方。2020年入选中国非遗年度人物候选人。'
    },
    {
        name: '李时亮',
        title: '国家级非遗传承人 · 北京药香',
        avatar: 'images/renwu2.png.',
        desc: '1980年生于北京，回族，药香第五代传人。自幼受外祖母、母亲熏陶，承袭北京德胜门百年药香家族秘传，系统深造中医理论，持有国际中医师资质。掌握千余家家传药香古方，收集民间古香方近万个，遵循中医君臣佐使，打造防疫、安神、辟瘴三大药香体系。2010年获联合国IOV优秀青年传承人大奖。'
    },
    {
        name: '林文溪',
        title: '国家级非遗传承人 · 永春篾香',
        avatar: 'images/renwu3.png.',
        desc: '1971年生，永春达埔汉口村人。1989年跟随祖父学习海丝古法篾香，传承蒲寿庚后裔制香脉络，深耕手工"掷香花"、抡香、裹粉核心技艺四十余年。创办兴隆香业，研发无烟篾香、雪梨檀香等数十款新品，拥有70余项行业奖项。担任中国香业协会副会长、燃香国标制定委员，推动永春"中国香都"香品远销四十余国。'
    },
    {
        name: '蒲良宫',
        title: '省级非遗传承人 · 永春篾香',
        avatar: 'images/renwu4.png.',
        desc: '蒲氏第17代传人，蒲寿庚海丝香料家族直系后人。六十余年坚守纯手工篾香古法，经营百年老字号"蒲庆兰香室"。掌握36味草本祖传兰花香秘方，坚持无化学添加，香材粉碎后可直接冲泡饮用。完整保留闽南古法制香全套工序，其子蒲海星为市级传承人，迪拜世博会斩获传承奖项。'
    },
    {
        name: '杨金庆',
        title: '国家级非遗传承人 · 清苑制香',
        avatar: 'images/renwu5.png.',
        desc: '1947年生，杨氏制香第四代传人。祖上经营百年"恒记香坊"，1982年创办古城香业复兴北方古法制香，走访全国老匠人、研读《香乘》复原二十余款古香。独创天然榆皮粘合工艺，编撰《中国香席与香道》等多部香文化专著。设立保定文化名家香文化工作室，培养300余名制香从业者。'
    },
    {
        name: '戴铁锚',
        title: '省级非遗传承人 · 小冈香',
        avatar: 'images/renwu6.png.',
        desc: '1953年生，出身小冈制香世家。少年随父复办兴华香厂，创立锚记香行，精通全套手工搓篾香核心技法。担任小冈香业联合会常务理事，策划香制作技艺擂台赛，常态化进校园开展手工搓香公益课。长子戴华进接续传承，为市级传承人，父子共同守护六百年岭南手搓香技艺。'
    },
    {
        name: '于青延',
        title: '省级核心传承人 · 南阳药香',
        avatar: 'images/renwu7.png.',
        desc: '于氏仲景药香第五代传人，家族自清嘉庆年间以医入香，扎根医圣张仲景故里。依托《伤寒论》六经辨证打造节气养生药香体系，掌握十六道古法炮制工序。以南阳道地宛艾、苍术、藿香为主料，严格遵循君臣佐使配伍。常年在南阳医专、社区开展非遗药香培训，全国培育五千余名药香疗愈从业者。'
    },
    {
        name: '周科羽',
        title: '区级核心传承人 · 杭州和香',
       avatar: 'images/renwu8.png.',
        desc: '百年制香老字号云景堂第九代传人，师承南宋临安宫廷香方脉络。深耕西湖四季特色合香，选用满觉陇桂花、西湖龙井、超山红梅等本土风物制香。担任杭州市文旅局宋韵讲师、中医药大学香道客座讲师，复原《陈氏香谱》二苏旧局、清远香等宋代名香，常年开展宋韵香文化研学雅集。'
    },
    {
        name: '王其标',
        title: '省级非遗传承人 · 扬州文人香',
        avatar: 'images/renwu9.png.',
        desc: '东方香学传承人，深耕运河文人香十余年，复原近百款唐宋古籍名香（韩魏公浓梅香、雪中春信、鼻观香等）。出版《扬州香事》《东方香学》香学专著，打造非遗工坊"中运香会"。2021年获评"邗城十大工匠"，复原明清扬州老香铺完整工艺体系。'
    },
    {
        name: '当曲旦增',
        title: '省级非遗传承人 · 敏珠林藏香',
       avatar: 'images/renwu10.png.',
        desc: '宁玛派祖庭敏珠林寺藏香第八代传人，承袭17世纪德达林巴大师秘传藏香方。掌握三十余种高原藏药、矿物古法配伍，完整传承水磨研磨、诵经加持全套寺院制香工序。创办敏珠林藏香厂，开发22款藏香系列产品，吸纳45名当地农牧民就业，纪录片《第三极》专题记录其制香工艺。'
    },
    {
        name: '余荣珍',
        title: '省级非遗传承人 · 布依族水磨制香',
        avatar: 'images/renwu11.png.',
        desc: '75岁，香车河村布依族制香世家。8岁跟随父母学习水磨擀香，从业66年。精通本地枫香、艾蒿、鸡血藤等山野草本配伍，掌握水磨碾浆、手工擀香、提香两大核心布依独有工艺。常年在乡村集市、非遗展演现场演示古法制香，完整保留布依族祭祀、居家养生原生用香民俗。'
    }
];

    var projectData = [
    // ==========================================================
    // 国家级非遗项目
    // ==========================================================
    {
        name: '莞香制作技艺',
        region: '广东省东莞市',
        level: '国家级',
        batch: '第四批（2014年）',
        code: 'VIII.-224',
        desc: '岭南沉香核心非遗，东莞本土沉香培育与古法合香技艺。莞香是本土特有沉香品类，古称"蜜香"，隋唐已有贡香记载。整套技艺涵盖植香结香、采料加工、古法合香三大阶段：人工创伤香树促油脂结香，历经数年自然孕育；采后分理、拣、刨、磨四道手工提纯去除木质杂料；再以君臣佐使配伍窨藏熟化，制成熏香、香丸、线香。古方包含宫廷帐香、养生药香，香气温润持久。现有国家级传承人黄欧，建立莞香博物馆、种植基地，兼顾文旅与古法复原。'
    },
    {
        name: '药香制作技艺（北京）',
        region: '北京市西城区',
        level: '国家级',
        batch: '第四批（2014年）',
        code: 'VIII.-224',
        desc: '北方中医药香正统传承，源自清末北京德胜门药栈，家族五代传承。依托两千年中医药理论，将中医辨证与合香君臣佐使深度结合。掌握千余款家传药香古方，收集民间古香方近万个。原料全部天然本草，不添加化学香精，区分安神、辟疫、清神、理气四大体系。成品涵盖香珠、香膏、篆香、线香全套形制。传承人李时亮为国家级传承人，整理明清古籍失传香方，2010年获联合国IOV优秀青年传承人大奖。'
    },
    {
        name: '福建香制作技艺（永春篾香）',
        region: '福建省',
        level: '国家级',
        batch: '第五批扩展（2021年）',
        code: 'VIII.-224',
        desc: '海上丝路融合型制香技艺，清代顺治年间起源，融合阿拉伯香料配伍与中华和香理论。以永春达埔篾香为核心，三百余年手工搓篾香传统。核心工序包含药材炮制、君臣佐使配粉、竹篾为骨手工搓香、阴干窨藏等十二道纯手工工序，无机械替代核心搓香步骤。香材包含沉香、檀香、苍术、甘松等数十味，兼顾民俗祭祀、居家熏香、养生香。当地传承十代以上香匠超千人，香企600余家，产品出口40余国，2014年获评"中国香都"。'
    },
    {
        name: '清苑传统制香技艺',
        region: '河北省保定市清苑区',
        level: '国家级',
        batch: '第五批扩展（2021年）',
        code: 'VIII.-224',
        desc: '北方大众线香核心技艺，冀中平原百年手工制香体系。依托本地榆树、野生芳香草本资源，独创天然榆皮粘合工艺，无需化学胶，香材粉碎后天然环保。工序包含采料、舂粉、和泥、挤线、晾晒、窖藏六大步骤，香方偏质朴草木调，多用于民俗祭祀、室内净化。产业覆盖周边村镇，走访全国老匠人、研读《香乘》复原二十余款古香，培养300余名制香从业者，是北方民间香文化典型代表。'
    },
    {
        name: '藏香制作技艺（尼木县）',
        region: '西藏自治区尼木县',
        level: '国家级',
        batch: '第二批（2008年）',
        code: 'VIII.-141',
        desc: '拥有1300余年雪域传承史，由吐蕃贤臣吞米·桑布扎创制，发源地为尼木县吞巴乡，当地留存250余座千年水磨长廊，是全球独有的水磨制香聚落。融合藏传佛教仪轨与藏医药理论，严格遵循《四部医典》，选用柏木、藏红花、沉香、檀香等三十余种高原天然药香。独有水磨研磨、牛角挤香、宗教加持全套手工工序，形成两大传承脉络：尼木水磨藏香（民间居家净化）与直孔藏香（寺院供养），是西藏藏传香文化活态核心技艺。'
    },
    {
        name: '敏珠林寺藏香制作技艺',
        region: '西藏自治区山南市',
        level: '国家级',
        batch: '第五批扩展',
        code: 'VIII.-141',
        desc: '源自山南敏珠林宁玛祖庭，为雪域三大正统藏香流派之一。由17世纪藏医大师德达林巴创立，传承四百余年，清代专供布达拉宫。技艺遵循《四部医典》，取用三十余种高原药材搭配矿物和合，全程僧人手工完成十余道工序，包含诵经加持全套寺院制香仪轨。旧时专供布达拉宫，兼具礼佛供养与芳香疗愈双重价值。创办敏珠林藏香厂，开发22款系列产品，纪录片《第三极》专题记录其制香工艺。'
    },

    // ==========================================================
    // 省级非遗项目
    // ==========================================================
    {
        name: '小冈香制作技艺',
        region: '广东江门新会区',
        level: '省级',
        batch: '广东省第六批',
        code: '',
        desc: '岭南手工手搓竹签香，600年历史，起源明代。以竹骨手工搓裹香粉为核心工艺，原料搭配沉香、檀香、陈皮、藿香等岭南特色草本。全套手工打粉、搋香、搓香、晒香、染脚五大工序，不依赖大型机械。香品分祭祀、养生、熏香三大类，明清远销东南亚。现有完整行业协会传承体系，配套香文化展馆，复原古代商用香方，常态化进校园开展手工搓香公益课。'
    },
    {
        name: '客家天和制香方',
        region: '江西赣州宁都县',
        level: '省级',
        batch: '江西省第六批',
        code: '',
        desc: '客家山区药香，四百余年家族十八代传承。适配赣南多瘴山林环境，香方主打除湿、驱虫、净化，全部取材深山原生草本如山苍子、茶树等，无进口香料。古法配伍兼顾客家祭祀与日常养生，拥有多项制香专利，设立香文化研究院，整理客家历代民间香方，面向乡村普及天然线香技艺，全国培育五千余名药香疗愈从业者。'
    },
    {
        name: '扬州文人香制作技艺',
        region: '江苏扬州邗江区',
        level: '省级',
        batch: '江苏省第五批（2023年）',
        code: '',
        desc: '运河文人合香代表，扬州自古香料集散枢纽，海陆丝路香料在此交汇，有"天下香料，莫如扬州"之说。宋代欧阳修、苏轼、韩琦等文人留下大量合香记载，《天香传》等香学著作诞生于此。遵循"和香如和药"君臣佐使理论，复原鹅梨帐中香、浓梅香、雪中春信、鼻观香等近百款唐宋古籍名香。出版《扬州香事》《东方香学》专著，2023年列入江苏省第五批省级非遗。'
    },

    // ==========================================================
    // 市级非遗项目
    // ==========================================================
    {
        name: '和香制作技艺（北京）',
        region: '北京市石景山区',
        level: '市级',
        batch: '北京市第五批（2021年）',
        code: '',
        desc: '北京宫廷古法和合香传承技艺，融合宫廷御香、佛寺供香、中医药香三大体系。北京和香文脉起于辽金寺院供香，元代融合宫廷熏香规制，明代内府设御香局，清代内务府专职司香，形成完整宫廷合香规范。八大处古刹群长期使用古法和香，民间香坊同步传承宫廷香方。北京香文化促进会系统整理宫廷古籍香方，复原数十款失传御香，2021年列入北京市第五批市级非遗。'
    }
];

    // ==========================================================
    // 页面切换（集成到主框架）
    // ==========================================================
    var heritagePages = ['heritage', 'inheritor', 'project', 'signature'];
    var heritagePageElements = {};

    heritagePages.forEach(function(id) {
        var el = document.getElementById('page-' + id);
        if (el) heritagePageElements[id] = el;
    });

    function showHeritagePage(pageId) {
        heritagePages.forEach(function(id) {
            var el = heritagePageElements[id];
            if (el) {
                el.classList.toggle('active', id === pageId);
            }
        });
        // 如果切换到签名页，初始化画布
        if (pageId === 'signature') {
            setTimeout(initSignature, 300);
        }
    }

    // ==========================================================
    // 主页卡片点击
    // ==========================================================
    document.querySelectorAll('.heritage-card').forEach(function(card) {
        card.addEventListener('click', function() {
            var target = this.dataset.target;
            if (target && heritagePageElements[target]) {
                showHeritagePage(target);
                // 渲染对应内容
                if (target === 'inheritor') renderInheritors();
                if (target === 'project') renderProjects();
            }
        });
    });

    // ==========================================================
    // 返回按钮
    // ==========================================================
    document.querySelectorAll('.back-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var target = this.dataset.back;
            if (target && heritagePageElements[target]) {
                showHeritagePage(target);
            }
        });
    });

    // ==========================================================
    // 传承人滑块
    // ==========================================================
    var currentInheritor = 0;

    function renderInheritors() {
        var slider = document.getElementById('inheritorSlider');
        if (!slider) return;
        slider.innerHTML = '';
        inheritorData.forEach(function(item, index) {
            var div = document.createElement('div');
            div.className = 'inheritor-item' + (index === currentInheritor ? ' active' : '');
            div.innerHTML = '<img class="avatar" src="' + item.avatar + '" alt="' + item.name + '" /><div class="name">' + item.name + '</div><div class="title-tag">' + item.title + '</div>';
            div.addEventListener('click', function() {
                currentInheritor = index;
                renderInheritors();
                updateInheritorDetail(index);
            });
            slider.appendChild(div);
        });
        updateInheritorDetail(currentInheritor);
    }

    function updateInheritorDetail(index) {
        var data = inheritorData[index];
        var nameEl = document.getElementById('detailName');
        var titleEl = document.getElementById('detailTitle');
        var descEl = document.getElementById('detailDesc');
        if (nameEl) nameEl.textContent = data.name;
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
    }

    // ==========================================================
// 相关项目 - 级别筛选
// ==========================================================
var currentLevel = 'all';
var currentProject = 0;

function renderProjects() {
    var tabs = document.getElementById('projectTabs');
    if (!tabs) return;
    tabs.innerHTML = '';
    
    // 根据级别筛选
    var filteredData = projectData;
    if (currentLevel !== 'all') {
        filteredData = projectData.filter(function(item) {
            return item.level === currentLevel;
        });
    }
    
    if (filteredData.length === 0) {
        tabs.innerHTML = '<div class="no-data">暂无该级别项目</div>';
        return;
    }
    
    if (currentProject >= filteredData.length) {
        currentProject = 0;
    }
    
    filteredData.forEach(function(item, index) {
        var btn = document.createElement('button');
        btn.className = 'project-tab' + (index === currentProject ? ' active' : '');
        btn.textContent = item.name;
        btn.addEventListener('click', function() {
            currentProject = index;
            renderProjects();
            updateProjectDetail(index);
        });
        tabs.appendChild(btn);
    });
    updateProjectDetail(currentProject);
}

function updateProjectDetail(index) {
    var filteredData = projectData;
    if (currentLevel !== 'all') {
        filteredData = projectData.filter(function(item) {
            return item.level === currentLevel;
        });
    }
    
    if (filteredData.length === 0 || index >= filteredData.length) return;
    
    var data = filteredData[index];
    
    var nameEl = document.getElementById('projectName');
    var regionEl = document.getElementById('projectRegion');
    var descEl = document.getElementById('projectDesc');
    
    if (nameEl) nameEl.textContent = data.name;
    
    var metaHtml = '';
    if (data.level) metaHtml += '<span class="meta-tag level">🏷️ ' + data.level + '非遗</span>';
    if (data.batch) metaHtml += '<span class="meta-tag batch">📅 ' + data.batch + '</span>';
    if (data.region) metaHtml += '<span class="meta-tag region">📍 ' + data.region + '</span>';
    if (data.code) metaHtml += '<span class="meta-tag code">📋 ' + data.code + '</span>';
    
    if (regionEl) regionEl.innerHTML = metaHtml;
    if (descEl) descEl.textContent = data.desc;
}







// ==========================================================
// 非遗级别分布饼图
// ==========================================================

function renderProjectPieChart() {
    var container = document.getElementById('projectPieContainer');
    var chartEl = document.getElementById('projectPieChart');
    var legendEl = document.getElementById('projectPieLegend');
    if (!container || !chartEl || !legendEl) return;
    
    // 只在"全部"Tab显示
    if (currentLevel !== 'all') {
        container.classList.remove('visible');
        return;
    }
    container.classList.add('visible');
    
    // 统计数据
    var levelCount = {};
    projectData.forEach(function(item) {
        var level = item.level || '其他';
        levelCount[level] = (levelCount[level] || 0) + 1;
    });
    
    var colors = {
        '国家级': '#f8a38f',
        '省级': '#d4a85c',
        '市级': '#8fc9d4'
    };
    
    var data = [];
    for (var key in levelCount) {
        data.push({ name: key, value: levelCount[key], color: colors[key] || '#b8945c' });
    }
    
    var total = data.reduce(function(sum, item) { return sum + item.value; }, 0);
    if (total === 0) return;
    
    // 生成SVG饼图
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.style.width = '100%';
    svg.style.height = '100%';
    
    var cx = 100, cy = 100, r = 80;
    var startAngle = -Math.PI / 2;
    var pieData = [];
    
    data.forEach(function(item) {
        var percent = item.value / total;
        var endAngle = startAngle + percent * 2 * Math.PI;
        var x1 = cx + r * Math.cos(startAngle);
        var y1 = cy + r * Math.sin(startAngle);
        var x2 = cx + r * Math.cos(endAngle);
        var y2 = cy + r * Math.sin(endAngle);
        var largeArc = percent > 0.5 ? 1 : 0;
        
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        var d = ['M', cx, cy, 'L', x1, y1, 'A', r, r, 0, largeArc, 1, x2, y2, 'Z'].join(' ');
        path.setAttribute('d', d);
        path.setAttribute('fill', item.color);
        path.setAttribute('stroke', 'rgba(30,21,16,0.5)');
        path.setAttribute('stroke-width', '1.5');
        svg.appendChild(path);
        
        pieData.push({
            name: item.name,
            value: item.value,
            color: item.color,
            percent: percent,
            midAngle: startAngle + (endAngle - startAngle) / 2
        });
        
        startAngle = endAngle;
    });
    
    // 中间圆
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', '30');
    circle.setAttribute('fill', 'rgba(30,21,16,0.85)');
    circle.setAttribute('stroke', 'rgba(248,163,143,0.1)');
    circle.setAttribute('stroke-width', '1');
    svg.appendChild(circle);
    
    // 中间文字
    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', cx);
    text.setAttribute('y', cy + 6);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', '#f8a38f');
    text.setAttribute('font-size', '20');
    text.setAttribute('font-weight', '700');
    text.textContent = total;
    svg.appendChild(text);
    
    chartEl.innerHTML = '';
    chartEl.appendChild(svg);
    
    // 图例
    legendEl.innerHTML = '';
    data.forEach(function(item) {
        var div = document.createElement('div');
        div.className = 'pie-legend-item';
        div.innerHTML = [
            '<span class="color-dot" style="background:' + item.color + '"></span>',
            '<span>' + item.name + '</span>',
            '<span class="count">' + item.value + '项</span>'
        ].join('');
        legendEl.appendChild(div);
    });
}

// 监听级别切换
document.querySelectorAll('.level-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.level-tab').forEach(function(t) {
            t.classList.remove('active');
        });
        this.classList.add('active');
        currentLevel = this.dataset.level;
        currentProject = 0;
        renderProjects();
        setTimeout(renderProjectPieChart, 50);
    });
});

// 页面激活时渲染
var projectPage = document.getElementById('page-project');
if (projectPage) {
    var projectObserver = new MutationObserver(function() {
        if (projectPage.classList.contains('active')) {
            setTimeout(renderProjectPieChart, 200);
        }
    });
    projectObserver.observe(projectPage, { attributes: true, attributeFilter: ['class'] });
}

// 初始渲染
setTimeout(renderProjectPieChart, 500);









// ★★★ 级别标签切换事件（加在这里） ★★★
document.querySelectorAll('.level-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.level-tab').forEach(function(t) {
            t.classList.remove('active');
        });
        this.classList.add('active');
        currentLevel = this.dataset.level;
        currentProject = 0;
        renderProjects();
    });
});

// ==========================================================
// 页面切换（集成到主框架）
// ==========================================================
// ... 后续代码保持不变

        // ==========================================================
    // 签名面板
    // ==========================================================
    var sigCanvas, sigCtx, isDrawing = false;

    function initSignature() {
        sigCanvas = document.getElementById('signatureCanvas');
        if (!sigCanvas) return;
        sigCtx = sigCanvas.getContext('2d');
        sigCtx.fillStyle = '#f5efe6';
        sigCtx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);
        sigCtx.strokeStyle = '#3d2a1b';
        sigCtx.lineWidth = 3;
        sigCtx.lineCap = 'round';
        sigCtx.lineJoin = 'round';

        var scaleX = sigCanvas.width / sigCanvas.getBoundingClientRect().width;
        var scaleY = sigCanvas.height / sigCanvas.getBoundingClientRect().height;

        function getPos(e) {
            var rect = sigCanvas.getBoundingClientRect();
            var clientX, clientY;
            if (e.touches) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
                e.preventDefault();
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
        }

        function startDraw(e) {
            isDrawing = true;
            var pos = getPos(e);
            sigCtx.beginPath();
            sigCtx.moveTo(pos.x, pos.y);
        }

        function draw(e) {
            if (!isDrawing) return;
            e.preventDefault();
            var pos = getPos(e);
            sigCtx.lineTo(pos.x, pos.y);
            sigCtx.stroke();
        }

        function endDraw() {
            if (isDrawing) { isDrawing = false; sigCtx.closePath(); }
        }

        sigCanvas.addEventListener('mousedown', startDraw);
        sigCanvas.addEventListener('mousemove', draw);
        sigCanvas.addEventListener('mouseup', endDraw);
        sigCanvas.addEventListener('mouseleave', endDraw);
        sigCanvas.addEventListener('touchstart', startDraw, { passive: false });
        sigCanvas.addEventListener('touchmove', draw, { passive: false });
        sigCanvas.addEventListener('touchend', endDraw);

        document.querySelectorAll('.sig-tool[data-action="clear"]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                sigCtx.fillStyle = '#f5efe6';
                sigCtx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);
            });
        });

        document.querySelectorAll('.sig-tool[data-action="submit-sig"]').forEach(function(btn) {
            btn.addEventListener('click', submitSignature);
        });
        
    }

    // ==========================================================
    // 弹幕系统 - JS 驱动版
    // ==========================================================

    function getBarrageContainer() {
        var container = document.getElementById('barrageContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'barrageContainer';
            container.className = 'barrage-container';
            document.body.insertBefore(container, document.body.firstChild);
            console.log('✅ 弹幕容器已创建');
        }
        return container;
    }

    // 存储所有活跃的弹幕
    var activeBarrages = [];

    // 弹幕动画循环
    function animateBarrages() {
        var container = document.getElementById('barrageContainer');
        if (!container) return;
        
        var toRemove = [];
        var now = Date.now();
        
        for (var i = 0; i < activeBarrages.length; i++) {
            var item = activeBarrages[i];
            var elapsed = now - item.startTime;
            var progress = elapsed / item.duration;
            
            if (progress >= 1) {
                if (item.el.parentNode) {
                    item.el.parentNode.removeChild(item.el);
                }
                toRemove.push(i);
            } else {
                var startX = window.innerWidth;
                var endX = -item.el.offsetWidth - 20;
                var currentX = startX + (endX - startX) * progress;
                item.el.style.transform = 'translateX(' + currentX + 'px)';
                
                var opacity = 1;
                if (progress < 0.05) {
                    opacity = progress / 0.05;
                } else if (progress > 0.9) {
                    opacity = 1 - (progress - 0.9) / 0.1;
                }
                item.el.style.opacity = opacity;
            }
        }
        
        for (var j = toRemove.length - 1; j >= 0; j--) {
            activeBarrages.splice(toRemove[j], 1);
        }
        
        if (activeBarrages.length > 0) {
            requestAnimationFrame(animateBarrages);
        }
    }

    function addBarrage(text, isSignature) {
        if (!text || text.trim() === '') {
            console.warn('⚠️ 弹幕内容为空');
            return;
        }
        
        console.log('💬 发送弹幕:', text);
        
        var container = getBarrageContainer();
        
        var el = document.createElement('div');
        var prefix = isSignature ? '✍️ ' : '✨ ';
        el.textContent = prefix + text.trim();
        
        var top = 5 + Math.random() * 80;
        var colors = ['#ffd700', '#f0d080', '#e8c84a', '#f5d990', '#f0c060', '#dab870', '#f5e0a0'];
        var color = colors[Math.floor(Math.random() * colors.length)];
        var fontSize = 1.0 + Math.random() * 1.4;
        
        el.style.cssText = `
            position: fixed !important;
            top: ${top}% !important;
            left: 0 !important;
            white-space: nowrap !important;
            font-family: "Georgia", "Times New Roman", "Songti SC", serif !important;
            font-weight: 700 !important;
            font-size: ${fontSize}rem !important;
            letter-spacing: 0.06em !important;
            color: ${color} !important;
            text-shadow: 0 0 20px rgba(184,148,92,0.6), 0 0 40px rgba(184,148,92,0.3), 0 0 80px rgba(184,148,92,0.15) !important;
            pointer-events: none !important;
            z-index: 99999999 !important;
            opacity: 0 !important;
            transform: translateX(${window.innerWidth}px) !important;
            will-change: transform, opacity !important;
        `;
        
        container.appendChild(el);
        
        var duration = 6000 + Math.random() * 8000;
        var startTime = Date.now();
        
        activeBarrages.push({
            el: el,
            startTime: startTime,
            duration: duration
        });
        
        console.log('✅ 弹幕已添加，当前数量:', activeBarrages.length);
        
        if (activeBarrages.length === 1) {
            animateBarrages();
        }
    }

    // ==========================================================
// 提交签名 - Tesseract.js 优化版
// ==========================================================

function submitSignature() {
    console.log('📝 提交签名被调用');
    
    if (!sigCanvas) {
        console.error('❌ 画布未初始化');
        return;
    }
    
    var imageData = sigCtx.getImageData(0, 0, sigCanvas.width, sigCanvas.height);
    var data = imageData.data;
    var hasDrawing = false;
    
    for (var i = 0; i < data.length; i += 4) {
        var r = data[i], g = data[i+1], b = data[i+2];
        if (Math.abs(r - 245) > 10 || Math.abs(g - 239) > 10 || Math.abs(b - 230) > 10) {
            hasDrawing = true;
            break;
        }
    }
    
    if (!hasDrawing) {
        alert('请在画布上写下你的名字～');
        return;
    }
    
    var submitBtn = document.querySelector('.sig-tool[data-action="submit-sig"]');
    var originalText = submitBtn.textContent;
    submitBtn.textContent = '🔍 识别中...';
    submitBtn.disabled = true;
    
    // ★★★ 对图像进行预处理，提高识别率 ★★★
    var tempCanvas = document.createElement('canvas');
    tempCanvas.width = sigCanvas.width * 2;  // 放大2倍
    tempCanvas.height = sigCanvas.height * 2;
    var tempCtx = tempCanvas.getContext('2d');
    
    // 放大并增强对比度
    tempCtx.drawImage(sigCanvas, 0, 0, tempCanvas.width, tempCanvas.height);
    var imageData2 = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    var data2 = imageData2.data;
    
    // 二值化处理（提高对比度）
    for (var i = 0; i < data2.length; i += 4) {
        var r = data2[i];
        var g = data2[i+1];
        var b = data2[i+2];
        var gray = 0.299 * r + 0.587 * g + 0.114 * b;
        var threshold = 180;
        var val = gray > threshold ? 255 : 0;
        data2[i] = val;
        data2[i+1] = val;
        data2[i+2] = val;
    }
    tempCtx.putImageData(imageData2, 0, 0);
    
    // 使用优化后的图像进行识别
    Tesseract.recognize(
        tempCanvas,
        'chi_sim',
        {
            logger: function(m) {
                if (m.status === 'recognizing text') {
                    console.log('🔍 识别进度:', Math.round(m.progress * 100) + '%');
                }
            },
            // ★★★ 优化参数 ★★★
            tessedit_char_whitelist: '一二三四五六七八九十甲乙丙丁天地人山水花鸟风月云雨雪林',
            tessedit_pageseg_mode: Tesseract.PSM_SINGLE_LINE,
        }
    ).then(function(result) {
        var recognizedText = result.data.text.trim();
        console.log('📝 识别结果:', recognizedText);
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // 智能过滤
        var cleanName = recognizedText.replace(/[\s\n\r.。，,、！!？?]+/g, '');
        cleanName = cleanName.replace(/[0-9]/g, '');
        
        if (cleanName.length >= 2 && cleanName.length <= 8) {
            console.log('✅ 识别成功:', cleanName);
            addBarrage(cleanName + ' · 传承有我', true);
            sigCtx.fillStyle = '#f5efe6';
            sigCtx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);
        } else {
            fallbackToManualInput();
        }
    }).catch(function(err) {
        console.error('❌ 识别失败:', err);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        fallbackToManualInput();
    });
}

function fallbackToManualInput() {
    var name = prompt('未能识别到文字，请输入你的名字（留空则显示为"一位香友"）：');
    if (name === null) return;
    var displayName = name.trim() || '一位香友';
    addBarrage(displayName + ' · 传承有我', true);
    sigCtx.fillStyle = '#f5efe6';
    sigCtx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);
}

    // ==========================================================
    // 输入框发送弹幕
    // ==========================================================
    var barrageInput = document.getElementById('barrageInput');
    var sendBtn = document.getElementById('sendBarrageBtn');

    if (barrageInput) {
        barrageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                var text = this.value.trim();
                if (text) {
                    console.log('📤 输入框发送:', text);
                    addBarrage(text, false);
                    this.value = '';
                }
            }
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            var text = barrageInput.value.trim();
            if (text) {
                console.log('📤 按钮发送:', text);
                addBarrage(text, false);
                barrageInput.value = '';
            }
        });
    }

    // ==========================================================
    // 初始化
    // ==========================================================
    console.log('✅ 非遗传承二级页面模块已加载');
    console.log('📦 传承人:', inheritorData.length, '位');
    console.log('📦 项目:', projectData.length, '个');
    console.log('💬 弹幕系统已就绪');
    
})();













function submitSignature() {
    console.log('📝 提交签名被调用');
    
    if (!sigCanvas) {
        console.error('❌ 画布未初始化');
        return;
    }
    
    var imageData = sigCtx.getImageData(0, 0, sigCanvas.width, sigCanvas.height);
    var data = imageData.data;
    var hasDrawing = false;
    
    for (var i = 0; i < data.length; i += 4) {
        var r = data[i], g = data[i+1], b = data[i+2];
        if (Math.abs(r - 245) > 10 || Math.abs(g - 239) > 10 || Math.abs(b - 230) > 10) {
            hasDrawing = true;
            break;
        }
    }
    
    if (!hasDrawing) {
        alert('请在画布上写下你的名字～');
        return;
    }
    
    // 可以保留 Tesseract.js 识别，或者直接使用弹窗输入
    // 这里使用弹窗输入（最可靠的方式）
    var name = prompt('请输入你的名字（留空则显示为"一位香友"）：');
    if (name === null) return;
    var displayName = name.trim() || '一位香友';
    addBarrage(displayName + ' · 传承有我', true);
    sigCtx.fillStyle = '#f5efe6';
    sigCtx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);
}



















// ==========================================================
// 香材使用频率柱状图
// ==========================================================

var herbFrequencyData = [
    { name: '沉香', value: 16 },
    { name: '檀香', value: 19 },
    { name: '龙脑', value: 15 },
    { name: '乳香', value: 9 },
    { name: '麝香', value: 7 },
    { name: '丁香', value: 4 }
];

var maxFrequency = 20;

function renderHerbChart() {
    var container = document.getElementById('herbChartContainer');
    var chartBars = document.getElementById('chartBars');
    if (!container || !chartBars) return;
    
    // 只在古代名香 Tab 显示
    var currentTab = document.querySelector('.spices-tab.active');
    var isRecipeTab = currentTab && currentTab.dataset.tab === 'recipe';
    container.style.display = isRecipeTab ? 'block' : 'none';
    
    if (!isRecipeTab) return;
    
    chartBars.innerHTML = '';
    
    herbFrequencyData.forEach(function(item) {
        var percent = (item.value / maxFrequency) * 100;
        var div = document.createElement('div');
        div.className = 'chart-bar-item';
        div.innerHTML = [
            '<div class="bar-track">',
            '    <div class="bar-fill" style="height:0%;" data-height="' + percent + '%"></div>',
            '</div>',
            '<div class="bar-value">' + item.value + '次</div>',
            '<div class="bar-label">' + item.name + '</div>'
        ].join('');
        chartBars.appendChild(div);
    });
    
    // 延迟触发动画
    setTimeout(function() {
        var fills = chartBars.querySelectorAll('.bar-fill');
        fills.forEach(function(fill) {
            var height = fill.dataset.height;
            fill.style.height = height;
        });
    }, 300);
}

// 监听 Tab 切换
var tabs = document.querySelectorAll('.spices-tab');
tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
        setTimeout(renderHerbChart, 200);
    });
});

// 页面激活时渲染
var spicesPage = document.getElementById('page-spices');
if (spicesPage) {
    var spicesObserver = new MutationObserver(function() {
        if (spicesPage.classList.contains('active')) {
            setTimeout(renderHerbChart, 500);
        }
    });
    spicesObserver.observe(spicesPage, { attributes: true, attributeFilter: ['class'] });
}










