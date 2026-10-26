'use strict';
/* Marginalia for iPad and phone. Reads and writes the desktop app's study files in OneDrive. */
const VERSION='1.4.1';
const CSS_VER='141';
const $=s=>document.querySelector(s);
/* Older index.html files lack some parts; add any that are missing so a partial upload can't break menus. */
[['mbar','toolbar'],['scrim',''],['menu','menu'],['ed','dialog'],['tx','dialog'],['toast','status'],['wn','dialog'],['pill','toolbar'],['sheet','dialog'],['selk','']].forEach(([id,role])=>{if(!document.getElementById(id)){const d=document.createElement('div');d.id=id;if(role)d.setAttribute('role',role);if(id==='scrim')d.dataset.act='scrim';document.body.appendChild(d)}});
if(!document.getElementById('rpanel')){const r=document.createElement('aside');r.id='rpanel';(document.getElementById('app')||document.body).appendChild(r)}
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
const pad=n=>String(n).padStart(2,'0');

/* ---------- icons ---------- */
/* ---------- icons: the desktop's set (bespoke Margin-line icons + Iconoir 7.9.0, MIT) ---------- */
const ICO={"nav-arrow-left": "<path d=\"M15 6L9 12L15 18\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "nav-arrow-right": "<path d=\"M9 6L15 12L9 18\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "nav-arrow-down": "<path d=\"M6 9L12 15L18 9\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "settings": "<path d=\"M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "filter": "<path d=\"M3.99961 3H19.9997C20.552 3 20.9997 3.44764 20.9997 3.99987L20.9999 5.58569C21 5.85097 20.8946 6.10538 20.707 6.29295L14.2925 12.7071C14.105 12.8946 13.9996 13.149 13.9996 13.4142L13.9996 19.7192C13.9996 20.3698 13.3882 20.8472 12.7571 20.6894L10.7571 20.1894C10.3119 20.0781 9.99961 19.6781 9.99961 19.2192L9.99961 13.4142C9.99961 13.149 9.89425 12.8946 9.70672 12.7071L3.2925 6.29289C3.10496 6.10536 2.99961 5.851 2.99961 5.58579V4C2.99961 3.44772 3.44732 3 3.99961 3Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "solid/filter": "<path d=\"M4.0001 3H20.0002C20.5525 3 21.0002 3.44764 21.0002 3.99987L21.0004 5.58569C21.0005 5.85097 20.8951 6.10538 20.7075 6.29295L14.293 12.7071C14.1055 12.8946 14.0001 13.149 14.0001 13.4142L14.0001 19.7192C14.0001 20.3698 13.3887 20.8472 12.7576 20.6894L10.7576 20.1894C10.3124 20.0781 10.0001 19.6781 10.0001 19.2192L10.0001 13.4142C10.0001 13.149 9.89474 12.8946 9.7072 12.7071L3.29299 6.29289C3.10545 6.10536 3.0001 5.851 3.0001 5.58579V4C3.0001 3.44772 3.44781 3 4.0001 3Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "arrow-union-vertical": "<path d=\"M17 4L12 9L7 4\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M17 20L12 15L7 20\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "arrow-separate-vertical": "<path d=\"M17 8L12 3L7 8\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M17 16L12 21L7 16\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "align-left": "<path d=\"M3 10L17 10\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M3 6H21\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M3 18L17 18\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M3 14H21\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "eye-closed": "<path d=\"M19.5 16L17.0248 12.6038\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M12 17.5V14\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M4.5 16L6.96895 12.6124\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M3 8C6.6 16 17.4 16 21 8\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "xmark": "<path d=\"M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "check": "<path d=\"M5 13L9 17L19 7\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "more-horiz": "<path d=\"M20 12.5C20.2761 12.5 20.5 12.2761 20.5 12C20.5 11.7239 20.2761 11.5 20 11.5C19.7239 11.5 19.5 11.7239 19.5 12C19.5 12.2761 19.7239 12.5 20 12.5Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M12 12.5C12.2761 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.7239 11.5 12C11.5 12.2761 11.7239 12.5 12 12.5Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M4 12.5C4.27614 12.5 4.5 12.2761 4.5 12C4.5 11.7239 4.27614 11.5 4 11.5C3.72386 11.5 3.5 11.7239 3.5 12C3.5 12.2761 3.72386 12.5 4 12.5Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "pin": "<path d=\"M9.5 14.5L3 21\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M5.00007 9.48528L14.1925 18.6777L15.8895 16.9806L15.4974 13.1944L21.0065 8.5211L15.1568 2.67141L10.4834 8.18034L6.69713 7.78823L5.00007 9.48528Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "solid/pin": "<path d=\"M9.5 14.5L3 21\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M5.00007 9.48528L14.1925 18.6777L15.8895 16.9806L15.4974 13.1944L21.0065 8.5211L15.1568 2.67141L10.4834 8.18034L6.69713 7.78823L5.00007 9.48528Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "trash": "<path d=\"M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M21 6L15.375 6M3 6L8.625 6M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6L15.375 6\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "solid/trash": "<path d=\"M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9\" fill=\"currentColor\"/><path d=\"M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9H20Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M21 6H15.375M3 6H8.625M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6H15.375\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "edit-pencil": "<path d=\"M14.3632 5.65156L15.8431 4.17157C16.6242 3.39052 17.8905 3.39052 18.6716 4.17157L20.0858 5.58579C20.8668 6.36683 20.8668 7.63316 20.0858 8.41421L18.6058 9.8942M14.3632 5.65156L4.74749 15.2672C4.41542 15.5993 4.21079 16.0376 4.16947 16.5054L3.92738 19.2459C3.87261 19.8659 4.39148 20.3848 5.0115 20.33L7.75191 20.0879C8.21972 20.0466 8.65806 19.8419 8.99013 19.5099L18.6058 9.8942M14.3632 5.65156L18.6058 9.8942\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "cloud": "<path d=\"M12 4C6 4 6 8 6 10C4.33333 10 1 11 1 15C1 19 4.33333 20 6 20H18C19.6667 20 23 19 23 15C23 11 19.6667 10 18 10C18 8 18 4 12 4Z\" stroke=\"currentColor\" stroke-linejoin=\"round\"/>", "cloud-sync": "<path d=\"M20 17.6073C21.4937 17.0221 23 15.6889 23 13C23 9 19.6667 8 18 8C18 6 18 2 12 2C6 2 6 6 6 8C4.33333 8 1 9 1 13C1 15.6889 2.50628 17.0221 4 17.6073\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M7.58059 19.4874L9.34836 21.2552C10.9105 22.8173 13.4431 22.8173 15.0052 21.2552L15.3588 20.9016\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M7.93413 21.9623L7.58058 19.4874L10.0554 19.841L7.93413 21.9623Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M16.2981 16.9016L14.5303 15.1339C12.9682 13.5718 10.4355 13.5718 8.87345 15.1339L8.51989 15.4874\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M15.9445 14.4268L16.2981 16.9017L13.8232 16.5481L15.9445 14.4268Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "cloud-xmark": "<path d=\"M9 22L12.0005 19M15 16L12.0005 19M12.0005 19L9 16M12.0005 19L15 22\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M20 17.6073C21.4937 17.0221 23 15.6889 23 13C23 9 19.6667 8 18 8C18 6 18 2 12 2C6 2 6 6 6 8C4.33333 8 1 9 1 13C1 15.6889 2.50628 17.0221 4 17.6073\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "chat-bubble": "<path d=\"M17 12.5C17.2761 12.5 17.5 12.2761 17.5 12C17.5 11.7239 17.2761 11.5 17 11.5C16.7239 11.5 16.5 11.7239 16.5 12C16.5 12.2761 16.7239 12.5 17 12.5Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M12 12.5C12.2761 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.7239 11.5 12C11.5 12.2761 11.7239 12.5 12 12.5Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M7 12.5C7.27614 12.5 7.5 12.2761 7.5 12C7.5 11.7239 7.27614 11.5 7 11.5C6.72386 11.5 6.5 11.7239 6.5 12C6.5 12.2761 6.72386 12.5 7 12.5Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "solid/chat-bubble": "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 13.8563 1.72113 15.6046 2.55076 17.1298L1.76267 21.3627C1.71742 21.6058 1.79485 21.8555 1.96967 22.0303C2.14448 22.2051 2.39422 22.2826 2.63727 22.2373L6.87016 21.4493C8.39536 22.2788 10.1437 22.75 12 22.75C17.937 22.75 22.75 17.937 22.75 12C22.75 6.06293 17.937 1.25 12 1.25ZM17 10.75C16.3097 10.75 15.75 11.3097 15.75 12C15.75 12.6903 16.3097 13.25 17 13.25C17.6903 13.25 18.25 12.6903 18.25 12C18.25 11.3097 17.6903 10.75 17 10.75ZM10.75 12C10.75 11.3097 11.3097 10.75 12 10.75C12.6903 10.75 13.25 11.3097 13.25 12C13.25 12.6903 12.6903 13.25 12 13.25C11.3097 13.25 10.75 12.6903 10.75 12ZM7 10.75C6.30961 10.75 5.75 11.3097 5.75 12C5.75 12.6903 6.30961 13.25 7 13.25C7.69039 13.25 8.25 12.6903 8.25 12C8.25 11.3097 7.69039 10.75 7 10.75Z\" fill=\"currentColor\"/>", "circle": "<path d=\"M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "link": "<path d=\"M14 11.9976C14 9.5059 11.683 7 8.85714 7C8.52241 7 7.41904 7.00001 7.14286 7.00001C4.30254 7.00001 2 9.23752 2 11.9976C2 14.376 3.70973 16.3664 6 16.8714C6.36756 16.9525 6.75006 16.9952 7.14286 16.9952\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M10 11.9976C10 14.4893 12.317 16.9952 15.1429 16.9952C15.4776 16.9952 16.581 16.9952 16.8571 16.9952C19.6975 16.9952 22 14.7577 22 11.9976C22 9.6192 20.2903 7.62884 18 7.12383C17.6324 7.04278 17.2499 6.99999 16.8571 6.99999\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "text": "<path d=\"M19 7V5L5 5V7\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M12 5L12 19M12 19H10M12 19H14\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "underline": "<path d=\"M16 5V11C16 13.2091 14.2091 15 12 15V15C9.79086 15 8 13.2091 8 11V5\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M6 19L18 19\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "plus": "<path d=\"M6 12H12M18 12H12M12 12V6M12 12V18\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "half-moon": "<path d=\"M3 11.5066C3 16.7497 7.25034 21 12.4934 21C16.2209 21 19.4466 18.8518 21 15.7259C12.4934 15.7259 8.27411 11.5066 8.27411 3C5.14821 4.55344 3 7.77915 3 11.5066Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "sun-light": "<path d=\"M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M22 12L23 12\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M12 2V1\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M12 23V22\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M20 20L19 19\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M20 4L19 5\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M4 20L5 19\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M4 4L5 5\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M1 12L2 12\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "refresh-double": "<path d=\"M21.1679 8C19.6247 4.46819 16.1006 2 11.9999 2C6.81459 2 2.55104 5.94668 2.04932 11\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M2.88146 16C4.42458 19.5318 7.94874 22 12.0494 22C17.2347 22 21.4983 18.0533 22 13\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M7.04932 16H2.64932C2.31795 16 2.04932 16.2686 2.04932 16.6V21\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "bold": "<path d=\"M12 11.6667H8M12 11.6667C12 11.6667 15.3333 11.6667 15.3333 8.33333C15.3333 5.00002 12 5 12 5C12 5 12 5 12 5H8.6C8.26863 5 8 5.26863 8 5.6V11.6667M12 11.6667C12 11.6667 16 11.6667 16 15.3333C16 19 12 19 12 19C12 19 12 19 12 19H8.6C8.26863 19 8 18.7314 8 18.4V11.6667\" stroke=\"currentColor\"/>", "italic": "<path d=\"M11 5L14 5M17 5L14 5M14 5L10 19M10 19L7 19M10 19L13 19\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "list": "<path d=\"M8 6L20 6\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M4 6.01L4.01 5.99889\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M4 12.01L4.01 11.9989\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M4 18.01L4.01 17.9989\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M8 12L20 12\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M8 18L20 18\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "key-command": "<path d=\"M9 6V18\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M15 6V18\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M9 6C9 4.34315 7.65685 3 6 3C4.34315 3 3 4.34315 3 6C3 7.65685 4.34315 9 6 9H18C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.3431 4.34315 15 6 15H18C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "highlight": "<path d=\"M14.2 4.6l5.2 5.2-8.6 8.6H5.6v-5.2z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M11.6 7.2l5.2 5.2\" stroke=\"currentColor\" stroke-linecap=\"round\"/><path d=\"M3.5 21h17\" stroke=\"currentColor\" stroke-linecap=\"round\"/>"};
const BESPOKE={"studies": {"o": "M3.5 4.5h4v16h-4zM7.5 6.5h4v14h-4zM12.6 7.6l3.9-1 3.9 13.5-3.9 1z", "d": "M3.5 8.5h4M3.5 16.5h4M7.5 10h4M7.5 16.5h4", "a": ["fill", "M4.75 4.5v3.6l.75-.6.75.6V4.5z"]}, "bible": {"o": "M6.5 2.5h12.75v15.5H6.5a2 2 0 0 0-2 2V4.5a2 2 0 0 1 2-2z", "x": "M4.5 20a2 2 0 0 0 2 2h12.75v-4", "d": "M12 6v7.5M9.25 8.75h5.5", "a": ["fill", "M14.6 20.4v3.1l1.25-1 1.25 1v-3.1z"]}, "devotional": {"x": "M2.5 17.5h19M7 21h10M12 6.2v2.3M5.4 9.1l1.6 1.6M18.6 9.1 17 10.7M2.9 14h2.2M18.9 14h2.2", "a": ["fillink", "M7 17.5a5 5 0 0 1 10 0z"]}, "search": {"x": "M3 9.5h5M3 13.5h3.2M18.7 17.2l3 3M15 8.5a5 5 0 1 1 0 10 5 5 0 1 1 0-10z", "a": ["stroke", "M3 5.5h9"]}, "new": {"o": "M4 4.5h7a1 1 0 0 1 1 1v15H5a1 1 0 0 1-1-1zM20 4.5h-7a1 1 0 0 0-1 1v15h7a1 1 0 0 0 1-1z", "d": "M6.5 9h3M6.5 12h3", "a": ["stroke", "M16 10v6M13 13h6"]}, "notes": {"o": "M5.5 4.5h13v17h-13z", "x": "M8.5 2.5v4M12 2.5v4M15.5 2.5v4", "d": "M8.5 13.5h7M8.5 16.5h4", "a": ["stroke", "M8.5 10.5h7"]}, "guide": {"x": "M4.5 21.5h15M8 19h8", "a": ["fill", "M12 2.5l1.6 5.4 5.4 1.6-5.4 1.6L12 16.5l-1.6-5.4L5 9.5l5.4-1.6z"]}};
const IC_ALIAS={"chevL": "nav-arrow-left", "chevR": "nav-arrow-right", "caretL": "nav-arrow-left", "caretR": "nav-arrow-right", "caretD": "nav-arrow-down", "book": "@studies", "cal": "@devotional", "search": "@search", "pad": "@notes", "gear": "settings", "sliders": "settings", "x": "xmark", "note": "chat-bubble", "comment": "chat-bubble", "pencil": "edit-pencil", "collapse": "arrow-union-vertical", "expand": "arrow-separate-vertical", "sync": "cloud-sync", "off": "cloud-xmark", "hlt": "highlight", "sidebar": "nav-arrow-left", "more": "more-horiz", "above": "text", "connect": "link", "justtext": "align-left", "eyeoff": "eye-closed"};
function ic(n,s=16){let k=IC_ALIAS[n]||n;const sw=s<=14?2.55:s<=16?2.25:2;const head=`<svg class="ico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">`;
 if(k[0]==='@'){const b=BESPOKE[k.slice(1)];let h='';['o','x','d'].forEach(t=>{if(b[t])h+=`<path d="${b[t]}"/>`});const [ty,d]=b.a;
  h+=ty==='stroke'?`<path d="${d}" style="stroke:var(--accent)"/>`:ty==='fill'?`<path d="${d}" style="fill:var(--accent);stroke:var(--accent);stroke-width:${sw/2}"/>`:`<path d="${d}" style="fill:var(--accent)"/>`;
  return head+h+'</svg>'}
 return head+(ICO[k]||'')+'</svg>'}
const icHas=n=>{const k=IC_ALIAS[n]||n;return k[0]==='@'?!!BESPOKE[k.slice(1)]:!!ICO[k]};
const ib=(n,act,label,extra='')=>`<button class="ib" data-act="${act}" aria-label="${label}" title="${label}" ${extra}>${ic(n)}</button>`;

/* ---------- Bible books ---------- */
const BOOKS=['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'];
const USFM='GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV'.split(' ');
const CHAPS=[50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22];
const bname=(b,withCh)=>b===18&&withCh?'Psalm':BOOKS[b]||'?';
function refStr(r){if(!r)return '';const n=bname(r.b,true);if(r.c1===r.c2){if(r.v1===1&&r.v2>=999)return `${n} ${r.c1}`;return r.v1===r.v2?`${n} ${r.c1}:${r.v1}`:`${n} ${r.c1}:${r.v1}–${r.v2}`}return `${n} ${r.c1}:${r.v1}–${r.c2}:${r.v2}`}

/* ---------- settings ---------- */
const LS={get:(k,d)=>{try{const v=localStorage.getItem('mg-'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem('mg-'+k,JSON.stringify(v))}catch(e){}}};
const CFG=Object.assign({clientId:'',account:'personal',tenant:'',folder:'Documents/Marginalia',keysPath:'Apps/Marginalia/keys.json'},window.MARGINALIA_CONFIG||{},LS.get('cfg',{}));
CFG.personal=CFG.account!=='work';
CFG.authority='https://login.microsoftonline.com/'+(CFG.personal?'consumers':(CFG.tenant&&CFG.tenant!=='organizations'?CFG.tenant:'organizations'));
const SET=Object.assign({theme:'auto',side:true,devoTr:'web',esvKey:'',abKey:'',tr:{},fold:true,nlay:'margin'},LS.get('set',{}));
const saveSet=()=>LS.set('set',SET);

/* ---------- local database ---------- */
const DB=(()=>{let p;const open=()=>p||(p=new Promise((ok,no)=>{const r=indexedDB.open('marginalia',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}));
 const tx=(m,f)=>open().then(db=>new Promise((ok,no)=>{const t=db.transaction('kv',m);const rq=f(t.objectStore('kv'));t.oncomplete=()=>ok(rq&&rq.result);t.onerror=()=>no(t.error)}));
 return {get:k=>tx('readonly',s=>s.get(k)),set:(k,v)=>tx('readwrite',s=>s.put(v,k)),del:k=>tx('readwrite',s=>s.delete(k))};})();

const S={studies:{},pending:[],devo:{log:{}},status:'',statusKind:'',me:null};

/* ---------- translations & text ---------- */
const TRS={kjv:{n:'KJV',src:'book'},web:{n:'WEB',src:'book'},esv:{n:'ESV',src:'esv',copy:'Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway. Used by permission.'},net:{n:'NET',src:'net',copy:'Scripture quoted by permission. Quotations designated (NET) are from the NET Bible® copyright ©1996, 2019 by Biblical Studies Press, L.L.C. All rights reserved.'},nkjv:{n:'NKJV',src:'ab'},csb:{n:'CSB',src:'ab'},nlt:{n:'NLT',src:'ab'},bsb:{n:'BSB',src:'none'},asv:{n:'ASV',src:'none'}};
const trName=t=>(TRS[t]&&TRS[t].n)||String(t||'').toUpperCase();
function trAvailable(t){const x=TRS[t];if(!x)return false;if(x.src==='book'||x.src==='net')return true;if(x.src==='esv')return !!SET.esvKey;if(x.src==='ab')return !!SET.abKey;return false}
const BOOKCACHE={},CH={},LOADING={},CHERR={};
const chKey=(tr,b,c)=>`${tr}|${b}|${c}`;
function normWs(s){return String(s).replace(/\s+/g,' ').trim()}
function decodeHtml(s){const d=document.createElement('textarea');d.innerHTML=s;return d.value}
/* Parses "[1] text [2] text" (ESV, API.Bible) into verses, keeping paragraph starts and poetry lines. */
function parseBracketed(raw){
 const out={v:[],p:[],s:[],q:{}};const re=/\[(\d+)\]/g;let m,marks=[];
 while((m=re.exec(raw)))marks.push({v:+m[1],i:m.index,end:re.lastIndex});
 marks.forEach((mk,k)=>{
  const chunk=raw.slice(mk.end,k+1<marks.length?marks[k+1].i:raw.length);
  const before=raw.slice(k?marks[k-1].end:0,mk.i);
  if(k===0||/\n[ \t]*$/.test(before))out.p.push(mk.v);
  if(/\n[ \t]*\n[ \t]*$/.test(before))out.s.push(mk.v);
  const lines=chunk.split('\n');let text='',offs=[],poem=false;
  lines.forEach((ln,i)=>{const t=normWs(ln);if(!t)return;const lead=(ln.match(/^ */)||[''])[0].length;if(i>0&&lead>=4)poem=true;if(text)text+=' ';offs.push([text.length,offs.length?1:0]);text+=t});
  if(poem&&offs.length>1)out.q[mk.v]=offs;
  out.v[mk.v-1]=text;
 });
 for(let i=0;i<out.v.length;i++)if(out.v[i]==null)out.v[i]='';
 return out;
}
function jsonp(url){return new Promise((ok,no)=>{const cb='__mg'+Math.random().toString(36).slice(2);const s=document.createElement('script');const t=setTimeout(()=>{cleanup();no(new Error('timeout'))},15000);function cleanup(){clearTimeout(t);delete window[cb];s.remove()}window[cb]=d=>{cleanup();ok(d)};s.onerror=()=>{cleanup();no(new Error('load'))};s.src=url+(url.includes('?')?'&':'?')+'callback='+cb;document.head.appendChild(s)})}
async function fetchChapter(tr,b,c){
 const x=TRS[tr];if(!x||x.src==='none')throw new Error(`${trName(tr)} isn’t available on this device`);
 if(x.src==='book'){
  if(!BOOKCACHE[tr+b]){const r=await fetch(`data/${tr}/${b}.json`);if(!r.ok)throw new Error('Text not found');BOOKCACHE[tr+b]=await r.json()}
  const bk=BOOKCACHE[tr+b],pre=c+':';const sel=a=>(a||[]).filter(k=>k.startsWith(pre)).map(k=>+k.slice(pre.length));
  const q={};Object.entries(bk.q||{}).forEach(([k,v])=>{if(k.startsWith(pre))q[+k.slice(pre.length)]=v});
  return {v:bk.v[c-1]||[],p:bk.p?sel(bk.p):null,s:sel(bk.s),q};
 }
 const key='text:'+chKey(tr,b,c);const cached=await DB.get(key).catch(()=>null);if(cached)return cached;
 let out;
 if(x.src==='esv'){
  if(!SET.esvKey)throw new Error('Add your ESV key in Settings');
  const q=encodeURIComponent(`${BOOKS[b]} ${c}`);
  const r=await fetch(`https://api.esv.org/v3/passage/text/?q=${q}&include-passage-references=false&include-verse-numbers=true&include-first-verse-numbers=true&include-footnotes=false&include-footnote-body=false&include-headings=false&include-short-copyright=false&include-copyright=false&include-passage-horizontal-lines=false&include-heading-horizontal-lines=false&include-selahs=true&indent-using=space&indent-paragraphs=2&indent-poetry=true&indent-poetry-lines=4&indent-declares=0&indent-psalm-doxology=0&line-length=0`,{headers:{Authorization:'Token '+SET.esvKey}});
  if(!r.ok)throw new Error(r.status===401||r.status===403?'The ESV key was refused':'ESV text unavailable ('+r.status+')');
  const d=await r.json();out=parseBracketed((d.passages||[''])[0]);
 }else if(x.src==='net'){
  const url=`https://labs.bible.org/api/?passage=${encodeURIComponent(BOOKS[b]+' '+c)}&type=json&formatting=para`;
  let d;try{const r=await fetch(url);if(!r.ok)throw 0;d=await r.json()}catch(e){d=await jsonp(url)}
  out={v:[],p:[],s:[],q:{}};
  (d||[]).forEach(it=>{if(+it.chapter!==c)return;const v=+it.verse;let h=String(it.text||'');
   if(/^\s*<p class="(bodytext|paragraphtitle)"/i.test(h))out.p.push(v);
   const poem=/class="poetry"/i.test(h);
   const parts=h.split(/<p[^>]*>|<br\s*\/?>/i).map(z=>normWs(decodeHtml(z.replace(/<[^>]+>/g,' ')))).filter(Boolean);
   let text='',offs=[];parts.forEach(z=>{if(text)text+=' ';offs.push([text.length,offs.length?1:0]);text+=z});
   if(poem&&offs.length>1)out.q[v]=offs;
   out.v[v-1]=text});
  for(let i=0;i<out.v.length;i++)if(out.v[i]==null)out.v[i]='';
  if(!out.p.length)out.p=null;
 }else if(x.src==='ab'){
  if(!SET.abKey)throw new Error('Add your API.Bible key in Settings');
  const id=await abBible(tr);
  const r=await fetch(`https://api.scripture.api.bible/v1/bibles/${id}/chapters/${USFM[b]}.${c}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`,{headers:{'api-key':SET.abKey}});
  if(!r.ok)throw new Error(trName(tr)+' text unavailable ('+r.status+')');
  const d=await r.json();out=parseBracketed(d.data.content||'');out.copy=d.data.copyright||'';
 }
 DB.set(key,out).catch(()=>{});return out;
}
async function abBible(tr){
 const ids=LS.get('abids',{});if(ids[tr])return ids[tr];
 const r=await fetch(`https://api.scripture.api.bible/v1/bibles?abbreviation=${encodeURIComponent(tr.toUpperCase())}`,{headers:{'api-key':SET.abKey}});
 if(!r.ok)throw new Error('The API.Bible key was refused');
 const d=await r.json();const hit=(d.data||[]).find(x=>String(x.abbreviation||x.abbreviationLocal).toLowerCase()===tr)||(d.data||[])[0];
 if(!hit)throw new Error(`Your API.Bible key doesn’t include ${trName(tr)}`);
 ids[tr]=hit.id;LS.set('abids',ids);return hit.id;
}
/* Translations without paragraph data (KJV, sometimes NET) borrow the WEB's paragraph and stanza breaks; poetry verses each start a line. */
async function withParagraphs(tr,b,c,d){
 if(tr==='web'||(d.p&&d.p.length))return d;
 try{const wb=await webBook(b),pre=c+':',pick=a=>(a||[]).filter(k=>k.startsWith(pre)).map(k=>+k.slice(pre.length));
  const poem=Object.keys(wb.q||{}).filter(k=>k.startsWith(pre)).map(k=>+k.slice(pre.length));
  return {...d,p:[...new Set([1,...pick(wb.p),...poem])],s:(d.s&&d.s.length)?d.s:pick(wb.s)}}catch(e){return d}
}
function chapter(tr,b,c){
 const k=chKey(tr,b,c);if(CH[k])return CH[k];
 if(!LOADING[k]&&!CHERR[k]){LOADING[k]=fetchChapter(tr,b,c).then(d=>withParagraphs(tr,b,c,d)).then(d=>{CH[k]=d;delete LOADING[k];render()}).catch(e=>{CHERR[k]=e.message||String(e);delete LOADING[k];render()})}
 return null;
}

/* ---------- Microsoft sign-in & OneDrive ---------- */
const SCOPES=['Files.ReadWrite','User.Read'];
let pca=null,account=null,needSignIn=false;
const redirectUri=()=>location.origin+location.pathname.replace(/index\.html$/,'');
async function initAuth(){
 if(!CFG.clientId||!window.msal)return;
 try{
  pca=new msal.PublicClientApplication({auth:{clientId:CFG.clientId,authority:CFG.authority,redirectUri:redirectUri()},cache:{cacheLocation:'localStorage'}});
  await pca.initialize();
  const r=await pca.handleRedirectPromise();
  account=(r&&r.account)||pca.getAllAccounts()[0]||null;
  if(account){pca.setActiveAccount(account);S.me=account.username||account.name}
 }catch(e){setStatus('Sign-in problem: '+(e.errorMessage||e.message||e),'err')}
}
function signIn(){if(!pca){toast('Add the app’s client ID first');return}pca.loginRedirect({scopes:SCOPES,prompt:'select_account'})}
async function signOut(){if(pca&&account){await pca.logoutRedirect({account,postLogoutRedirectUri:redirectUri()})}}
async function token(){
 try{return (await pca.acquireTokenSilent({scopes:SCOPES,account})).accessToken}
 catch(e){needSignIn=true;render();throw new Error('signin')}
}
const G='https://graph.microsoft.com/v1.0';
const encPath=p=>p.split('/').filter(Boolean).map(encodeURIComponent).join('/');
async function gfetch(path,opt={}){const t=await token();return fetch(path.startsWith('http')?path:G+path,{...opt,headers:{Authorization:'Bearer '+t,...(opt.headers||{})}})}

/* ---------- study changes (kept until they reach OneDrive) ---------- */
function applyOps(d,ops,touch=true){
 const x=JSON.parse(JSON.stringify(d));x.annotations=x.annotations||[];
 for(const o of ops){
  if(o.op==='add'){if(!x.annotations.some(a=>a.id===o.a.id))x.annotations.push(o.a)}
  else if(o.op==='upd'){const a=x.annotations.find(a=>a.id===o.id);if(a)Object.assign(a,o.patch)}
  else if(o.op==='del'){x.annotations=x.annotations.filter(a=>a.id!==o.id)}
  else if(o.op==='set'){const {dev,...rest}=o.patch;Object.assign(x,rest);if(dev)x.dev={...(x.dev||{}),...dev}}
 }
 if(touch&&ops.length)x.updatedAt=new Date().toISOString();
 return x;
}
async function savePending(){await DB.set('pending',S.pending)}
async function saveStudies(){await DB.set('studies',S.studies)}
let syncT=0;
function commit(op){
 const last=S.pending[S.pending.length-1];
 if(op.op==='upd'&&last&&last.op==='upd'&&last.id===op.id&&last.sid===op.sid)Object.assign(last.patch,op.patch);
 else if(op.op==='upd'&&last&&last.op==='add'&&last.a.id===op.id&&last.sid===op.sid)Object.assign(last.a,op.patch);
 else if(op.op==='set'&&last&&last.op==='set'&&last.sid===op.sid){const {dev,...rest}=op.patch;Object.assign(last.patch,rest);if(dev)last.patch.dev={...(last.patch.dev||{}),...dev}}
 else S.pending.push(op);
 const st=S.studies[op.sid];if(st)st.d=applyOps(st.d,[op]);
 savePending();saveStudies();
 clearTimeout(syncT);syncT=setTimeout(()=>sync(),2500);
}
let syncing=false;
async function sync(manual){
 if(syncing)return;
 if(!account){if(manual)toast('Sign in first');return}
 if(!navigator.onLine){setStatus(S.pending.length?`Offline · ${S.pending.length} change${S.pending.length>1?'s':''} waiting`:'Offline · showing saved copies','warn');return}
 syncing=true;setStatus('Syncing…');
 try{
  await pushPending();
  const base=`/me/drive/root:/${encPath(CFG.folder)}/studies:/children?$select=id,name,eTag,lastModifiedDateTime&$top=999`;
  const r=await gfetch(base);
  if(r.status===404)throw new Error(`No studies folder at “${CFG.folder}/studies” in OneDrive`);
  if(!r.ok)throw new Error('OneDrive said '+r.status);
  const items=(await r.json()).value.filter(x=>/\.json$/i.test(x.name));
  const seen=new Set();
  for(const it of items){
   const id=it.name.replace(/\.json$/i,'');seen.add(id);const loc=S.studies[id];
   if(!loc||loc.eTag!==it.eTag){
    const cr=await gfetch(`/me/drive/items/${it.id}/content`);if(!cr.ok)continue;
    let d;try{d=await cr.json()}catch(e){continue}
    const mine=S.pending.filter(o=>o.sid===id);
    S.studies[id]={d:mine.length?applyOps(d,mine,false):d,itemId:it.id,eTag:it.eTag};
   }
  }
  for(const id of Object.keys(S.studies))if(!seen.has(id)&&!S.pending.some(o=>o.sid===id))delete S.studies[id];
  await saveStudies();
  await syncDevo();
  await devMigrate();
  await loadKeys();
  LS.set('lastSync',Date.now());needSignIn=false;
  setStatus('');render();
  if(S.pending.length){clearTimeout(syncT);syncT=setTimeout(()=>sync(),1500)}
 }catch(e){
  if(e.message!=='signin')setStatus(e.message||String(e),'err');else setStatus('Sign in again to sync','warn');
 }finally{syncing=false}
}
async function pushPending(){
 const by={};S.pending.forEach(o=>(by[o.sid]=by[o.sid]||[]).push(o));
 for(const [sid,ops] of Object.entries(by)){
  const loc=S.studies[sid];if(!loc)continue;
  if(!loc.itemId){
   const nw=ops.find(o=>o.op==='new');if(!nw)continue;
   const doc=applyOps(nw.d,ops.filter(o=>o!==nw),false);
   const put=await gfetch(`/me/drive/root:/${encPath(CFG.folder)}/studies/${encodeURIComponent(sid)}.json:/content?@microsoft.graph.conflictBehavior=fail`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(doc,null,1)});
   if(put.ok){const it=await put.json();S.studies[sid]={d:doc,itemId:it.id,eTag:it.eTag};S.pending=S.pending.filter(o=>!ops.includes(o));await savePending();await saveStudies();continue}
   if(put.status===409){const mr=await gfetch(`/me/drive/root:/${encPath(CFG.folder)}/studies/${encodeURIComponent(sid)}.json?$select=id,eTag`);if(mr.ok){const it=await mr.json();loc.itemId=it.id;S.pending=S.pending.filter(o=>o!==nw);ops.splice(ops.indexOf(nw),1)}else throw new Error('Saving a new reading failed')}
   else throw new Error('Saving a new reading failed ('+put.status+')');
   if(!ops.length)continue;
  }
  let done=false;
  for(let attempt=0;attempt<3&&!done;attempt++){
   const mr=await gfetch(`/me/drive/items/${loc.itemId}?$select=id,eTag`);
   if(mr.status===404){S.pending=S.pending.filter(o=>o.sid!==sid);await savePending();delete S.studies[sid];done=true;break}
   if(!mr.ok)throw new Error('OneDrive said '+mr.status);
   const meta=await mr.json();
   const cr=await gfetch(`/me/drive/items/${loc.itemId}/content`);if(!cr.ok)throw new Error('Reading the study failed ('+cr.status+')');
   const next=applyOps(await cr.json(),ops);
   const put=await gfetch(`/me/drive/items/${loc.itemId}/content`,{method:'PUT',headers:{'Content-Type':'application/json','If-Match':meta.eTag},body:JSON.stringify(next,null,1)});
   if(put.status===412)continue;
   if(!put.ok)throw new Error('Saving to OneDrive failed ('+put.status+')');
   const it=await put.json();
   S.studies[sid]={d:next,itemId:loc.itemId,eTag:it.eTag};
   S.pending=S.pending.filter(o=>!ops.includes(o));await savePending();await saveStudies();done=true;
  }
  if(!done)throw new Error('The study kept changing while saving; will try again');
 }
}
async function loadKeys(){
 if(SET.esvKey&&SET.abKey)return;
 try{
  const r=await gfetch(`/me/drive/root:/${encPath(CFG.keysPath||'Apps/Marginalia/keys.json')}:/content`);if(!r.ok)return;
  const k=await r.json();let ch=false;
  const flat=(o,pre='')=>Object.entries(o||{}).flatMap(([a,v])=>v&&typeof v==='object'?flat(v,pre+a+'.'):[[ (pre+a).toLowerCase(),v]]);
  for(const [name,v] of flat(k)){if(typeof v!=='string'||!v.trim())continue;
   if(!SET.esvKey&&name.includes('esv')){SET.esvKey=v.trim();ch=true}
   else if(!SET.abKey&&/apibible|api\.bible|scripture|(^|\.)ab(key)?$|abkey/.test(name)){SET.abKey=v.trim();ch=true}}
  if(ch){saveSet();Object.keys(CHERR).forEach(x=>delete CHERR[x])}
 }catch(e){}
}
async function syncDevo(){
 const r=await gfetch(`/me/drive/root:/${encPath(CFG.folder)}/mobile-devotional.json:/content`);
 if(!r.ok)return;let remote={};try{remote=await r.json()}catch(e){return}
 S.devo={log:{...(remote.log||{}),...(S.devo.log||{})}};await DB.set('devo',S.devo);
}

/* ---------- marks from the study file ---------- */
const PALETTE=['#5b8afe','#e96f73','#5bba88','#f7c948','#f59e5b','#a78bfa'];
const KIND={highlight:'hl',underline:'ul',circle:'circ',note:'cm',above:'above',connect:'conn'};
const KLABEL={highlight:'Highlight',underline:'Underline',circle:'Circle',note:'Comment',above:'Words above',connect:'Connection',arrow:'Arrow'};
const okHex=c=>/^#[0-9a-f]{3,8}$/i.test(c||'')?c:'#5b8afe';
const USTYLE={solid:'solid',double:'double',dashed:'dashed',dotted:'dotted',squiggly:'wavy',hand:'solid'};
function anchor(sp,t){
 if(t==null)return null;const x=sp.text||'';
 if(sp.s>=0&&sp.e<=t.length&&sp.e>sp.s&&(!x||t.slice(sp.s,sp.e)===x))return [sp.s,sp.e];
 if(!x)return null;
 const near=(hay,nd)=>{let best=-1,bd=1e9,i=hay.indexOf(nd);while(i>=0){const d=Math.abs(i-(sp.s||0));if(d<bd){bd=d;best=i}i=hay.indexOf(nd,i+1)}return best};
 let i=near(t,x);if(i>=0)return [i,i+x.length];
 const n=s=>s.replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,'-').toLowerCase();
 i=near(n(t),n(x));if(i>=0)return [i,i+x.length];
 return null;
}
/* The desktop's Filter: types, colors and tags (marks that don't match fade), plus Just the text. */
const FS={kinds:new Set(),colors:new Set(),tags:new Set(),just:false};
const filterOn=()=>FS.kinds.size+FS.colors.size+FS.tags.size>0;
function fsReset(){FS.kinds.clear();FS.colors.clear();FS.tags.clear();FS.just=false;ui.fdelArm=false}
function annMatch(a){if(FS.kinds.size&&!FS.kinds.has(a.kind))return false;if(FS.colors.size&&!FS.colors.has(String(a.color||'').toLowerCase()))return false;if(FS.tags.size&&!(a.tags||[]).some(t=>FS.tags.has(t)))return false;return true}
function annVisible(a){return !(FS.just&&ui.view==='study')}
function marksFor(st,tr,b,c,v,text){
 const out=[];
 (st.annotations||[]).forEach(a=>{if(!annVisible(a))return;(a.spans||[]).forEach(sp=>{
  if(sp.tr!==tr||sp.b!==b||sp.c!==c||sp.v!==v)return;
  const r=anchor(sp,text);if(!r)return;
  out.push({id:a.id,kind:KIND[a.kind]||'cm',c:okHex(a.color),us:a.kind==='connect'?((a.line&&a.line.style)||'dashed'):(USTYLE[a.ustyle]||'solid'),ab:a.kind==='above'?(a.above||''):null,s:r[0],e:r[1],dim:filterOn()&&!annMatch(a)});
 })});
 return out;
}
function markup(t,ms,lines){
 if(!ms.length&&!lines)return esc(t);
 const b=new Set([0,t.length]),ls=new Map();
 ms.forEach(m=>{b.add(Math.max(0,Math.min(t.length,m.s)));b.add(Math.max(0,Math.min(t.length,m.e)))});
 (lines||[]).forEach(([o,l])=>{if(o>=0&&o<=t.length){b.add(o);ls.set(o,l)}});
 const pts=[...b].sort((x,y)=>x-y);const ord={circ:0,above:1,ul:2,conn:3,hl:4,cm:5};let h='';
 for(let i=0;i<pts.length-1;i++){const a=pts[i],z=pts[i+1];let seg=esc(t.slice(a,z)),pre='';
  if(ls.has(a)){if(a>0)pre='<br>';if(ls.get(a))pre+=`<span class="ind" style="width:${ls.get(a)*1.6}em"></span>`}
  ms.filter(m=>m.s<=a&&m.e>=z).sort((x,y)=>ord[y.kind]-ord[x.kind]).forEach(m=>{
   let st=`--mc:${m.c}`;if(m.kind==='ul')st+=`;text-decoration-style:${m.us}`;if(m.kind==='circ'&&m.us==='dotted')st+=';border-style:dotted';if(m.kind==='conn')st+=`;border-bottom-style:${m.us}`;
   seg=`<span class="m k-${m.kind}${m.dim?' fdim':''}" style="${st}" data-m="${esc(m.id)}"${m.ab!=null?` data-above="${esc(m.ab)}"`:''}>${seg}</span>`});
  h+=pre+seg;ms.filter(m=>m.bub&&m.e===z).forEach(m=>{h+=`<button class="bub" data-act="bub" data-id="${esc(m.id)}" aria-label="Open comment">${ic('comment',14)}</button>`})}
 return h;
}

/* ---------- markdown for notes and Study notes ---------- */
function inl(s){s=esc(s);return s.replace(/==\{(#[0-9a-fA-F]{6})\}(.+?)==/g,'<mark style="background:color-mix(in srgb,$1 30%,transparent)">$2</mark>').replace(/==(.+?)==/g,'<mark>$1</mark>').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|[^*])\*([^*]+)\*/g,'$1<i>$2</i>').replace(/(^|\W)_([^_]+)_(?=\W|$)/g,'$1<i>$2</i>')}
function md(src){
 let h='',list=null;const close=()=>{if(list){h+=`</${list}>`;list=null}};
 for(const raw of String(src||'').split('\n')){const l=raw.replace(/\s+$/,'');let m;
  if(!l.trim()){close();continue}
  if((m=l.match(/^(#{1,3})\s+(.*)/))){close();const n=m[1].length+1;h+=`<h${n}>${inl(m[2])}</h${n}>`;continue}
  if((m=l.match(/^\s*[-*]\s+(.*)/))){if(list!=='ul'){close();h+='<ul>';list='ul'}h+=`<li>${inl(m[1])}</li>`;continue}
  if((m=l.match(/^\s*\d+\.\s+(.*)/))){if(list!=='ol'){close();h+='<ol>';list='ol'}h+=`<li>${inl(m[1])}</li>`;continue}
  if((m=l.match(/^>\s?(.*)/))){close();h+=`<blockquote>${inl(m[1])}</blockquote>`;continue}
  close();h+=`<p>${inl(l)}</p>`}
 close();return h;
}
const plainMd=s=>String(s||'').replace(/==\{#[0-9a-fA-F]{6}\}/g,'').replace(/\*\*|==|\*/g,'').replace(/^\s*(?:-|\d+\.)\s+/gm,'');

/* ---------- scripture text settings ---------- */
const FONTS=[['source','Source Serif','"Source Serif 4",Georgia,serif'],['literata','Literata','Literata,Georgia,serif'],['georgia','Georgia','Georgia,"Times New Roman",serif'],['charter','Charter','Charter,"Bitstream Charter","Iowan Old Style",Georgia,serif'],['palatino','Palatino','Palatino,"Palatino Linotype","Book Antiqua",Georgia,serif'],['sans','Sans serif','Figtree,Inter,system-ui,-apple-system,sans-serif']];
const LH=[['1.5','Tight'],['1.75','Normal'],['2','Relaxed'],['2.3','Airy']];
const TDEF={font:'source',size:1,lh:'1.75',vn:true,layout:'verse'};
const tset=()=>Object.assign({},TDEF,LS.get('text',{}));
const curLayout=()=>ui.view==='devmode'?LS.get('devLayout',tset().layout):tset().layout;
function applyText(){const t=tset(),r=document.documentElement.style,f=FONTS.find(x=>x[0]===t.font)||FONTS[0];r.setProperty('--sfont',f[2]);r.setProperty('--tsz',t.size);r.setProperty('--tlh',t.lh);$('#app').classList.toggle('novn',!t.vn);$('#tx').classList.toggle('novn',!t.vn)}
function txtHtml(){const t=tset();return `<div class="grab"></div><div style="display:flex;align-items:center;margin-bottom:8px"><b style="font-size:16px;flex:1">Scripture text</b>${ib('x','txtx','Close')}</div><p class="vt tpv"><span class="vn">1</span>In the beginning was the Word, and the Word was with God…</p><div class="lbl">Font</div><div class="tfs">${FONTS.map(([k,l,f])=>`<button class="${t.font===k?'on':''}" style="font-family:${f.replace(/"/g,'&quot;')}" data-act="tfont" data-k="${k}">${l}</button>`).join('')}</div><div class="lbl">Size</div><div class="trw"><button class="btn2" style="padding:6px 12px" data-act="tsize" data-d="-1" aria-label="Smaller">A−</button><input type="range" id="tsz" min="0.8" max="1.6" step="0.05" value="${t.size}" aria-label="Text size"><button class="btn2" style="padding:6px 12px;font-size:17px" data-act="tsize" data-d="1" aria-label="Larger">A+</button><b id="tszv">${Math.round(t.size*100)}%</b></div><div class="lbl">Line spacing</div><div class="seg" style="margin-bottom:12px">${LH.map(([v,l])=>`<button class="${t.lh===v?'on':''}" data-act="tlh" data-v="${v}">${l}</button>`).join('')}</div><div class="lbl">Verse numbers</div><div class="seg" style="margin-bottom:14px"><button class="${t.vn?'on':''}" data-act="tvn" data-v="1">Show</button><button class="${t.vn?'':'on'}" data-act="tvn" data-v="0">Hide</button></div>${ui.view==='devmode'?`<div class="lbl">Layout</div><div class="seg" style="margin-bottom:12px">${[['verse','Verses'],['para','Paragraphs']].map(([v,l])=>`<button class="${curLayout()===v?'on':''}" data-act="tlay" data-v="${v}">${l}</button>`).join('')}</div><div class="lbl">Comments beside the text</div><div class="seg" style="margin-bottom:8px"><button class="${SET.devMargin!==false?'on':''}" data-act="dmargin" data-v="1">Show</button><button class="${SET.devMargin===false?'on':''}" data-act="dmargin" data-v="0">Hide</button></div><div class="lbl">Light</div><div class="seg" style="margin-bottom:14px"><button class="${SET.devLight!=='day'?'on':''}" data-act="dlight" data-v="hour">By the hour</button><button class="${SET.devLight==='day'?'on':''}" data-act="dlight" data-v="day">Always day</button></div>`:''}<div style="display:flex;justify-content:flex-start"><button class="quiet" data-act="treset">Reset to the defaults</button></div>`}
function setText(p){if('layout' in p&&ui.view==='devmode'){LS.set('devLayout',p.layout);render();const x=$('#tx');if(x.classList.contains('open'))x.innerHTML=txtHtml();return}LS.set('text',Object.assign(tset(),p));applyText();if('layout' in p)render();const x=$('#tx');if(x.classList.contains('open'))x.innerHTML=txtHtml()}

/* ---------- UI state ---------- */
const WIDE=matchMedia('(min-width:980px)');
const MID=matchMedia('(min-width:680px)');
const ui={selCard:null,view:'studies',back:'studies',sid:null,tab:'passage',sel:null,bar:null,barMore:false,edit:null,color:3,flash:null,flashV:null,sumOpen:false,q:'',cal:null,dr:null,another:0,unfold:new Set()};
const studyList=()=>Object.values(S.studies).map(x=>x.d).filter(d=>d&&d.kind!=='devotional').sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
const cur=()=>{const x=S.studies[ui.view==='devmode'?ui.devSid:ui.sid];return x&&x.d};
const studyTr=st=>{const list=(st.translations||[]).filter(Boolean);const pick=SET.tr[st.id];return pick||list.find(trAvailable)||list[0]||'kjv'};
const sideOpen=()=>SET.side!==false;
const allTags=()=>{const t=new Set();studyList().forEach(s=>(s.annotations||[]).forEach(a=>(a.tags||[]).forEach(x=>t.add(x))));['Question','Observation','Interpretation','Application','Cross-reference'].forEach(x=>t.add(x));return [...t]};
const marginOn=()=>MID.matches&&SET.nlay!=='under';

/* ---------- sync dot ---------- */
function syncInfo(){
 const p=S.pending.length,last=LS.get('lastSync',0);let msg=S.status,kind=S.statusKind;
 if(!msg){if(!account)msg=CFG.clientId?'Not signed in':'Not set up yet';else if(p)msg=`${p} change${p>1?'s':''} waiting to sync`;else msg=last?'Synced '+new Date(last).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}):'Not synced yet'}
 if(!kind){if(syncing)kind='busy';else if(p||!account)kind='warn';else kind='ok'}
 return {msg,kind};
}
function syncDot(){const s=syncInfo();return `<button class="sdot ${s.kind}" id="sdot" data-act="syncinfo" aria-label="${esc(s.msg)}" title="${esc(s.msg)}"></button>`}
function syncLine(){const s=syncInfo();return `<div class="sync ${s.kind==='err'?'err':s.kind==='warn'?'warn':''}" id="syncline">${ic(s.kind==='err'?'off':'cloud',14)}<span>${esc(s.msg)}</span></div>`}
function setStatus(msg,kind=''){S.status=msg;S.statusKind=kind;const d=document.getElementById('sdot');if(d)d.outerHTML=syncDot();const l=document.getElementById('syncline');if(l)l.outerHTML=syncLine()}

/* ---------- top bar ---------- */
const backIcon=(v,label)=>`<button class="ib backi" data-act="nav" data-v="${v}" aria-label="${label}" title="${label}">${ic('chevL',20)}</button>`;

/* ---------- views ---------- */
function vSetup(){
 return {bar:`<div class="bt">Marginalia</div>`,body:`<div class="setup"><h2>This site isn’t set up yet</h2><p>Marginalia needs the Application (client) ID from your Microsoft app registration. Put it in <b>config.js</b> on the site (the README explains where to find it), and this screen won’t appear again.</p><p><button class="quiet" data-act="nav" data-v="settings">Set it up on this device instead</button></p></div>`};
}
function vSignin(){
 return {bar:topbar(`<div class="bt">Marginalia</div>`),body:`<div class="setup"><h2>Sign in to see your studies</h2><p>Use the ${CFG.personal?'personal Microsoft account':'work account'} whose OneDrive has your Marginalia folder.</p><button class="btn" data-act="signin">Sign in with Microsoft</button></div>`};
}
function banners(){
 return account&&needSignIn?`<div class="banner">${ic('cloud',16)}<span style="flex:1">Sign in again to keep syncing.</span><button class="btn" style="padding:6px 12px" data-act="signin">Sign in</button></div>`:'';
}
function vStudies(){
 const list=studyList();
 if(!CFG.clientId&&!list.length)return vSetup();
 if(!list.length&&!account)return vSignin();
 const g={};list.forEach(s=>(g[s.series||'Studies']=g[s.series||'Studies']||[]).push(s));
 return {bar:topbar(`<div class="bt">Studies</div>`),
  body:`${banners()}<div class="pg">${list.length?Object.entries(g).map(([k,ss])=>`<div class="ghead">${esc(k)}</div>${ss.map(s=>`<button class="sl" data-act="open" data-s="${esc(s.id)}"><b>${esc(s.title||'Untitled')}</b><span>${esc((s.passages||[]).map(p=>refStr(p.ref)).join(', '))} · ${(s.annotations||[]).filter(a=>a.note).length} notes</span></button>`).join('')}`).join(''):`<p class="muted">${syncing?'Loading your studies…':'No studies found yet. Check the folder in Settings.'}</p>`}</div>`};
}
function filterLabel(){const n=FS.kinds.size+FS.colors.size+FS.tags.size;if(n!==1)return 'Filter';if(FS.kinds.size)return KLABEL[[...FS.kinds][0]]||'Filter';if(FS.tags.size)return '#'+[...FS.tags][0];return 'One color'}
const filterCount=st=>(st&&st.annotations||[]).filter(annMatch).length;
const KICON={highlight:'hlt',underline:'underline',circle:'circle',note:'comment',above:'above',connect:'connect'};
function filterPane(st){
 const anns=st.annotations||[],cnt=f=>anns.filter(f).length;
 const kinds=['highlight','underline','circle','note','above','connect'].filter(k=>anns.some(a=>a.kind===k));
 const colors=[...new Set(anns.map(a=>String(a.color||'').toLowerCase()).filter(c=>/^#[0-9a-f]{3,8}$/.test(c)))];
 const tags=[...new Set(anns.flatMap(a=>a.tags||[]))];
 const n=filterCount(st);
 return `<div class="fpane"><button class="fjust" data-act="fjust"><span class="tog${FS.just?' on':''}"></span><span><b>Just the text</b><small>Hides every mark and note</small></span></button>
 <div class="msec">Type</div><div class="fchips">${kinds.map(k=>`<button class="fc${FS.kinds.has(k)?' on':''}" data-act="ftog" data-g="kinds" data-v="${k}"${FS.just?' disabled':''}>${ic(KICON[k],14)}${KLABEL[k]}<small>${cnt(a=>a.kind===k)}</small></button>`).join('')||'<span class="muted" style="font-size:12.5px">No marks yet</span>'}</div>
 ${colors.length?`<div class="msec">Color</div><div class="fchips">${colors.map(c=>`<button class="fsw${FS.colors.has(c)?' on':''}" style="background:${c}" data-act="ftog" data-g="colors" data-v="${c}" aria-label="Color ${c}"${FS.just?' disabled':''}></button>`).join('')}</div>`:''}
 ${tags.length?`<div class="msec">Tags</div><div class="fchips">${tags.map(t=>`<button class="fc${FS.tags.has(t)?' on':''}" data-act="ftog" data-g="tags" data-v="${esc(t)}"${FS.just?' disabled':''}>#${esc(t)}<small>${cnt(a=>(a.tags||[]).includes(t))}</small></button>`).join('')}</div>`:''}
 <div class="ffoot">${FS.just?'<span class="muted">Everything hidden; your work is kept</span>':filterOn()?`<button class="quiet" data-act="fclear">Clear</button><button class="quiet red" data-act="fdel">${ui.fdelArm?`Tap again to delete ${n} mark${n===1?'':'s'}`:`Delete these ${n} mark${n===1?'':'s'}…`}</button>`:'<span class="muted">Pick a type, color or tag</span>'}</div></div>`;
}
function passageRows(st,p,tr){
 const r=p.ref;if(!r)return '';
 const para=curLayout()==='para';const rows=[];let err=null,loading=false,copy='';
 for(let c=r.c1;c<=r.c2;c++){
  const ch=chapter(tr,r.b,c);
  if(!ch){const e=CHERR[chKey(tr,r.b,c)];if(e)err=e;else loading=true;continue}
  if(ch.copy)copy=ch.copy;
  const from=c===r.c1?r.v1:1,to=c===r.c2?Math.min(r.v2,ch.v.length):ch.v.length;
  for(let v=from;v<=to;v++)rows.push({c,v,t:ch.v[v-1]||'',ch});
 }
 if(err)return `<p class="ph" style="padding:12px 20px">${esc(err)}. <button class="quiet" data-act="retry" data-tr="${esc(tr)}">Try again</button></p>`;
 if(loading)return `<p class="ph" style="padding:12px 20px">Loading ${esc(trName(tr))} text…</p>`;
 const multi=r.c1!==r.c2;
 const vlabel=(c,v,first)=>`<span class="vn">${multi&&(v===1||first)?`<span class="cvn">${c}:</span>`:''}${v}</span>`;
 const groups=[];
 rows.forEach(x=>{
  const fmtP=x.ch.p,isPoem=para&&x.ch.q&&x.ch.q[x.v];
  const starts=!groups.length||!para||isPoem||(fmtP?fmtP.includes(x.v):true)||groups[groups.length-1].poem||x.v===1;
  if(starts)groups.push({items:[x],poem:!!isPoem,stz:para&&x.ch.s&&x.ch.s.includes(x.v)});else groups[groups.length-1].items.push(x);
 });
 const html=groups.map((g,gi)=>{
  const ids=g.items.map(x=>`${p.id}-${x.c}-${x.v}`);const cards=[];
  const parts=g.items.map((x,i)=>{
   const ms=marksFor(st,tr,r.b,x.c,x.v,x.t);
   (st.annotations||[]).forEach(a=>{if(!annVisible(a))return;const sp=(a.spans||[]).find(s=>s.tr===tr&&s.b===r.b&&s.c===x.c&&s.v===x.v);if(!sp)return;if((a.spans||[]).find(s=>s.tr===tr)!==sp)return;if(a.note||(a.tags&&a.tags.length)||a.kind==='connect'||a.kind==='above'||ui.edit===a.id)cards.push({a,anch:!!anchor(sp,x.t)})});
   return (i?`<span class="va" id="v-${ids[i]}"></span>`:'')+vlabel(x.c,x.v,gi===0&&i===0)+`<span class="vtx" data-p="${esc(p.id)}" data-c="${x.c}" data-v="${x.v}">${markup(x.t,ms,para&&x.ch.q?x.ch.q[x.v]:null)}</span>`;
  }).join(' ');
  return `<div class="vrow${ids.includes(ui.flashV)?' flash':''}${g.stz?' stz':''}" id="v-${ids[0]}"><p class="vt${g.poem?' poem':''}">${parts}</p><div class="cards">${cards.map(cardHtml).join('')}</div></div>`;
 }).join('');
 const cp=copy||(TRS[tr]&&TRS[tr].copy)||'';
 return html+(cp?`<p class="copy">${esc(cp)}</p>`:'');
}
function cardHtml({a,anch}){
 const st=cur()||{};const tag=a.titleTag||(a.tags||[])[0];const t=tag||KLABEL[a.kind]||cap(a.kind);
 const col=(tag&&st.tagColors&&st.tagColors[tag])||okHex(a.color);
 const words=(a.spans||[]).map(s=>s.text).filter(Boolean);
 const folded=SET.fold!==false&&!ui.unfold.has(a.id)&&ui.edit!==a.id&&ui.flash!==a.id;
 const edit=ui.edit===a.id;
 if(folded)return `<div class="nc fold${filterOn()&&!annMatch(a)?' fdim':''}" role="button" tabindex="0" data-act="card" data-m="${esc(a.id)}" id="c-${esc(a.id)}"><span class="nt" style="color:${col}">${esc(t)}</span><span class="fx">${esc(plainMd(a.note).replace(/\n+/g,' ')||words[0]||'')}</span></div>`;
 let extra='';
 if(a.kind==='above'&&a.above)extra=`<span class="ntags">Above: ${esc(a.above)}</span>`;
 if(a.kind==='connect'&&words.length>1)extra=`<span class="ntags">Connects “${esc(words[0])}” with “${esc(words[1])}”</span>`;
 const more=(a.tags||[]).filter(x=>x!==tag),sel=ui.selCard===a.id;
 return `<div class="nc${ui.flash===a.id?' flash':''}${edit?' editing':''}${sel?' sel':''}${filterOn()&&!annMatch(a)?' fdim':''}" role="button" tabindex="0" data-act="card" data-m="${esc(a.id)}" id="c-${esc(a.id)}"><span class="ntop"><span class="nt" style="color:${col}">${esc(t)}</span><em class="nq k-${KIND[a.kind]||'cm'}" style="--mc:${okHex(a.color)}">${esc(words[0]||'')}</em>${sel&&more.length?`<span class="ctags">${more.map(x=>'#'+esc(x)).join(' ')}</span>`:''}${sel?`<button class="cmore" data-act="menu" data-m="card" data-id="${esc(a.id)}" aria-label="Note options" title="Note options">${ic('more',16)}</button>`:''}</span>${a.note?`<div class="nb">${md(a.note)}</div>`:''}${extra}${!sel&&more.length?`<span class="ntags">${more.map(x=>'#'+esc(x)).join(' ')}</span>`:''}${anch?'':'<span class="unanch">These words weren’t found in this text.</span>'}</div>`;
}
function vSearch(){return {bar:`${backIcon(ui.back||'studies','Back')}<div class="bt">Search</div>`,body:`<div class="pg"><input class="qin" id="q" type="search" placeholder="Search your studies, notes and devotional" value="${esc(ui.q)}" autocomplete="off"><div id="res">${results()}</div></div>`}}
function results(){
 const q=ui.q.trim().toLowerCase();if(q.length<2)return '<p class="muted" style="font-size:14px">Type at least two letters.</p>';
 const hi=t=>{t=String(t);const i=t.toLowerCase().indexOf(q);if(i<0)return esc(t.slice(0,140));const a=Math.max(0,i-50);return (a?'…':'')+esc(t.slice(a,i))+'<mark>'+esc(t.slice(i,i+q.length))+'</mark>'+esc(t.slice(i+q.length,i+q.length+80))+(i+q.length+80<t.length?'…':'')};
 const out=[];
 studyList().forEach(s=>{
  if(String(s.title||'').toLowerCase().includes(q))out.push(`<button class="res" data-act="open" data-s="${esc(s.id)}"><b>Study</b><span>${hi(s.title)}</span></button>`);
  (s.annotations||[]).forEach(a=>{const t=plainMd(a.note)+' '+(a.tags||[]).join(' ')+' '+(a.spans||[]).map(x=>x.text).join(' ');if(t.toLowerCase().includes(q)){const sp=(a.spans||[])[0]||{};const p=(s.passages||[]).find(p=>p.ref&&p.ref.b===sp.b)||(s.passages||[])[0]||{};out.push(`<button class="res" data-act="goto" data-s="${esc(s.id)}" data-p="${esc(p.id||'')}" data-c="${sp.c}" data-v="${sp.v}" data-tr="${esc(sp.tr||'')}" data-m="${esc(a.id)}"><b>${esc(s.title)} · ${esc(bname(sp.b,true))} ${sp.c}:${sp.v}</b><span>${hi(plainMd(a.note)||(a.spans||[]).map(x=>x.text).join(' '))}</span></button>`)}});
  String(s.outline||'').split('\n').forEach(l=>{if(l.toLowerCase().includes(q))out.push(`<button class="res" data-act="gonotes" data-s="${esc(s.id)}"><b>Study notes, ${esc(s.title)}</b><span>${hi(plainMd(l.replace(/^[#>\s]+/,'')))}</span></button>`)});
 });
 devList().forEach(d=>{const t=[d.title,plainMd(d.outline),...(d.annotations||[]).map(a=>plainMd(a.note))].join(' ');if(t.toLowerCase().includes(q))out.push(`<button class="res" data-act="devopen" data-s="${esc(d.id)}"><b>Devotional, ${kdate(d.dev.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})} · ${esc(d.title)}</b><span>${hi(t)}</span></button>`)});
 Object.entries(S.devo.log||{}).forEach(([k,e])=>{if(devFor(k))return;const t=Object.values(e.f||{}).map(plainMd).join(' ');if((e.ref+' '+t).toLowerCase().includes(q))out.push(`<button class="res" data-act="day" data-d="${k}"><b>Devotional, ${kdate(k).toLocaleDateString('en-US',{month:'short',day:'numeric'})} · ${esc(e.ref)}</b><span>${hi(t||e.ref)}</span></button>`)});
 return out.length?`<p class="muted" style="font-size:13px;margin:4px 2px 8px">${out.length} found</p>`+out.slice(0,200).join(''):'<p class="muted" style="font-size:14px">Nothing found.</p>';
}

/* ---------- devotional: readings are study files with kind 'devotional', shared with the desktop ---------- */
const dkey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const kdate=k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)};
const DEV_POOLS={Psalms:[18],Proverbs:[19],Gospels:[39,40,41,42],Epistles:[44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64]};
const DTPL={free:{n:'Free write',h:[]},inductive:{n:'Inductive',h:[['Observe','What does it say?'],['Interpret','What does it mean? What does it show about God?'],['Apply','What will I do, or believe differently?']]},lectio:{n:'Lectio divina',h:[['Lectio','Which words or phrases stood out?'],['Meditatio','What stays with me?'],['Oratio','My response to God'],['Contemplatio','Rest in it']]},soap:{n:'SOAP',h:[['Scripture','A verse to hold on to'],['Observation','What do I notice?'],['Application','How does it apply today?'],['Prayer','A short prayer']]},hhh:{n:'Head, Heart, Hands',h:[['Head','What I learned'],['Heart','What I felt'],['Hands','What I’ll do']]},pray:{n:'Pray the passage',h:[['Prayer','Turn each phrase into a prayer']]}};
const HINTS={};Object.values(DTPL).forEach(t=>t.h.forEach(([h,x])=>{if(!HINTS[h])HINTS[h]=x}));
const tplOutline=id=>(DTPL[id]||DTPL.inductive).h.map(([t])=>`### ${t}\n`).join('\n');
const devoTr=()=>trAvailable(SET.devoTr)?SET.devoTr:'web';
const devList=()=>Object.values(S.studies).map(x=>x&&x.d).filter(d=>d&&d.kind==='devotional'&&d.dev&&d.dev.date);
const devFor=k=>devList().filter(d=>d.dev.date===k).sort((a,b)=>(a.dev.extra?1:0)-(b.dev.extra?1:0))[0];
const devBody=o=>String(o||'').split('\n').filter(l=>l.trim()&&!/^#{1,6}\s/.test(l)).join('').trim();
const devTouched=d=>(d.annotations||[]).length>0||!!devBody(d.outline);
const devRef=d=>d&&d.passages&&d.passages[0]&&d.passages[0].ref;
function chLen(b,c){const bk=BOOKCACHE['web'+b];return bk&&bk.v[c-1]?bk.v[c-1].length:0}
function devTitle(r){const n=chLen(r.b,r.c1);return r.c1===r.c2&&r.v1===1&&(!n||r.v2>=n)?`${BOOKS[r.b]} ${r.c1}`:r.c1===r.c2?`${BOOKS[r.b]} ${r.c1}:${r.v1}–${r.v2}`:`${BOOKS[r.b]} ${r.c1}:${r.v1}–${r.c2}:${r.v2}`}
async function webBook(b){if(!BOOKCACHE['web'+b]){const r=await fetch(`data/web/${b}.json`);BOOKCACHE['web'+b]=await r.json()}return BOOKCACHE['web'+b]}
/* Portions: natural passages of about 8-20 verses from the WEB paragraph breaks (whole psalms up to 30 verses), like the desktop's. */
const PORTIONS={};
async function portionsFor(b){
 if(PORTIONS[b])return PORTIONS[b];
 const bk=await webBook(b),P=new Set(bk.p||[]),out=[];
 bk.v.forEach((vs,ci)=>{const c=ci+1,n=vs.length;if(!n)return;
  if(b===18&&n<=30){out.push([c,1,c,n]);return}
  const starts=[1];for(let v=2;v<=n;v++)if(P.has(c+':'+v))starts.push(v);
  let cur=null;
  starts.map((s,i)=>[s,(starts[i+1]||n+1)-1]).forEach(([s,e])=>{if(!cur){cur=[s,e];return}const len=cur[1]-cur[0]+1;if(len>=8&&len+(e-s+1)>20){out.push([c,cur[0],c,cur[1]]);cur=[s,e]}else cur[1]=e});
  if(cur){if(cur[1]-cur[0]+1<5&&out.length&&out[out.length-1][0]===c)out[out.length-1][3]=cur[1];else out.push([c,cur[0],c,cur[1]])}
 });
 PORTIONS[b]=out;return out;
}
function seedOf(str){let h=2166136261;for(const ch of str){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function pickBook(seed){const pools=Object.values(DEV_POOLS).flat();const total=pools.reduce((n,b)=>n+CHAPS[b],0);let r=seed%total;for(const b of pools){if(r<CHAPS[b])return b;r-=CHAPS[b]}return pools[0]}
async function devPick(date,n){
 const read=new Set(devList().map(d=>{const r=devRef(d);return r?`${r.b}:${r.c1}:${r.v1}`:''}));
 for(let k=0;k<60;k++){const s=seedOf(date+'|'+n+'|'+k);const b=pickBook(s);const ps=await portionsFor(b);const p=ps[(s>>>7)%ps.length];if(!p||read.has(`${b}:${p[0]}:${p[1]}`))continue;return {b,c1:p[0],v1:p[1],c2:p[2],v2:p[3]}}
 return {b:18,c1:23,v1:1,c2:23,v2:6};
}
const poolOf=b=>Object.entries(DEV_POOLS).find(([,bs])=>bs.includes(b))?.[0]||'';
function devProposal(date){
 const key=date+'|'+ui.another;
 if(ui.devProp&&ui.devProp.key===key)return ui.devProp.ref;
 if(!ui.devPropBusy){ui.devPropBusy=true;devPick(date,ui.another).then(ref=>{ui.devPropBusy=false;ui.devProp={key,ref};render()}).catch(()=>{ui.devPropBusy=false})}
 return null;
}
const rid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
function newDev(date,ref,extra){
 const id='st_'+rid(),now=new Date().toISOString(),tmpl=LS.get('devTpl','inductive');
 const d={id,title:devTitle(ref),series:'Devotional',createdAt:now,updatedAt:now,translations:[devoTr()],layout:'under',passages:[{id:'p_'+rid(),ref}],annotations:[],outline:tplOutline(tmpl),summary:'',headings:[],labels:[],kind:'devotional',dev:{date,plan:'surprise',tmpl,done:false},boxes:[],v18:1,tagColors:{},v19:1};
 if(extra)d.dev.extra=true;
 S.studies[id]={d,itemId:null,eTag:null};S.pending.push({op:'new',sid:id,d:JSON.parse(JSON.stringify(d))});
 savePending();saveStudies();clearTimeout(syncT);syncT=setTimeout(()=>sync(),1200);
 return d;
}
async function devStart(date){
 let d=devFor(date);
 if(!d){const ref=date===dkey(new Date())?(devProposal(date)||await devPick(date,ui.another)):await devPick(date,0);await webBook(ref.b);d=newDev(date,ref)}
 devOpen(d.id);
}
function devOpen(id,toNotes){ui.devSid=id;ui.view='devmode';closeEd(true);hideBar();closeMenu();lastKey='';ui.devCtl=false;render();const b=$('#body');b.scrollTop=0;if(toNotes){const n=document.getElementById('devwr');if(n)n.scrollIntoView({block:'start'})}}
/* The desktop's devotional light: morning by day, dusk after 6 pm, the evening look in dark mode. */
function devLight(){const dark=document.documentElement.dataset.theme==='dark'||(document.documentElement.dataset.theme!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);if(dark)return 'dark';if(SET.devLight==='day')return 'morn';const h=new Date().getHours();return h>=18||h<5?'eve':'morn'}
const DEV_BG={morn:'#fbf8f2',eve:'#f5eff0',dark:'#14152a'};
function setThemeColor(c){let m=document.getElementById('tc-dev');if(!c){if(m)m.remove();return}if(!m){m=document.createElement('meta');m.name='theme-color';m.id='tc-dev';document.head.appendChild(m)}m.content=c}


/* ---------- full-screen devotional mode ---------- */
const isWholeVerse=(sp,t)=>sp.s<=0&&sp.e>=t.replace(/\s+$/,'').length-1;
function devVerseHtml(st,tr,b,x,para){
 const ms=[],bubbles=[],margin=[],opened=[];
 (st.annotations||[]).forEach(a=>(a.spans||[]).forEach(sp=>{
  if(sp.tr!==tr||sp.b!==b||sp.c!==x.c||sp.v!==x.v)return;
  if(a.kind==='note'&&isWholeVerse(sp,x.t)){if((SET.devMargin!==false||ui.edit===a.id)&&(sp===(a.spans||[])[0]))margin.push({a,whole:1,s:-1});return}
  const r=anchor(sp,x.t);if(!r)return;
  const m={id:a.id,kind:KIND[a.kind]||'cm',c:okHex(a.color),us:USTYLE[a.ustyle]||'solid',ab:a.kind==='above'?(a.above||''):null,s:r[0],e:r[1]};
  if(a.kind==='note'&&(SET.devMargin!==false||ui.edit===a.id)&&sp===(a.spans||[])[0])margin.push({a,whole:0,s:r[0]});
  ms.push(m);
 }));
 const html=markup(x.t,ms,para&&x.ch.q?x.ch.q[x.v]:null);
 return {html,margin,opened};
}
function vDevMode(){
 const st=cur();if(!st){ui.view='devo';return vDevo()}
 const tr=(st.translations||[])[0]||devoTr(),p=(st.passages||[])[0],r=p&&p.ref;
 const para=curLayout()==='para',light=devLight();
 let rows='',vcount=0,words=0,loading=false,err=null,copy='';
 if(r){for(let c=r.c1;c<=r.c2;c++){const ch=chapter(tr,r.b,c);if(!ch){const e=CHERR[chKey(tr,r.b,c)];if(e)err=e;else loading=true;continue}
   if(ch.copy)copy=ch.copy;
   const from=c===r.c1?r.v1:1,to=c===r.c2?Math.min(r.v2,ch.v.length):ch.v.length;const items=[];
   for(let v=from;v<=to;v++){const t=ch.v[v-1]||'';items.push({c,v,t,ch});vcount++;words+=t.split(/\s+/).length}
   const groups=[];items.forEach(x=>{const poem=para&&x.ch.q&&x.ch.q[x.v];const starts=!groups.length||!para||poem||(x.ch.p?x.ch.p.includes(x.v):true)||groups[groups.length-1].poem;if(starts)groups.push({poem:!!poem,stz:para&&x.ch.s&&x.ch.s.includes(x.v),items:[x]});else groups[groups.length-1].items.push(x)});
   const mwHtml=list=>list.sort((x,y)=>x.s-y.s).map(({a,whole})=>{const sp=(a.spans||[])[0]||{},ed=ui.edit===a.id;const head=whole?'':`<em class="q">${esc(sp.text||'')}</em>`;
     return `<div class="mw${ed?' editing':''}" data-c="${sp.c}" data-v="${sp.v}"${ed?'':` data-act="mwedit" data-id="${esc(a.id)}" role="button"`}>${head}${ed?`<div class="cwtext" id="enote" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Comment" data-ph="Write a comment">${a.note?md(a.note):''}</div>`:a.note?`<div class="cwb">${md(a.note)}</div>`:'<span class="mwph2">Write a comment…</span>'}</div>`}).join('');
   const side=MID.matches;
   rows+=groups.map(g=>{const pcls=`vt${g.poem?' poem':''}`;let parts=[],marg=[],html='';
    g.items.forEach((x,i)=>{const o=devVerseHtml(st,tr,r.b,x,para);parts.push(`<span class="vn" data-act="vwrite" data-c="${x.c}" data-v="${x.v}" role="button" title="Write about this verse">${r.c1!==r.c2&&x.v===1?c+':':''}${x.v}</span><span class="vtx" data-p="${esc(p.id)}" data-c="${x.c}" data-v="${x.v}">${o.html}</span>`);
     if(side)marg.push(...o.margin);
     else if(o.margin.length){html+=`<p class="${pcls}${html?' cont':''}">${parts.join(' ')}</p><div class="dmarg">${mwHtml(o.margin)}</div>`;parts=[]}});
    if(side)return `<div class="drow${g.stz?' stz':''}"><p class="${pcls}">${parts.join(' ')}</p><div class="dmarg">${mwHtml(marg)}</div></div>`;
    if(parts.length)html+=`<p class="${pcls}${html?' cont':''}">${parts.join(' ')}</p>`;
    return `<div class="drow${g.stz?' stz':''}">${html}</div>`}).join('');
 }}
 const dl=kdate(st.dev.date).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
 const tmpl=(DTPL[st.dev.tmpl]?st.dev.tmpl:LS.get('devTpl','inductive'));
 const cp=copy||(TRS[tr]&&TRS[tr].copy)||'';
 const body=`<div class="dvt ${light}" id="dvt"><div class="dprog" id="dprog"></div><div class="dvcol">
  <div class="dlab">${esc(dl)}</div><div class="dref">${esc(st.title||'')}</div><div class="dmeta">${vcount} verses · about ${Math.max(1,Math.round(words/200))} minute${Math.round(words/200)>1?'s':''}${st.dev.done?' · done':''}</div>
  ${err?`<p class="ph">${esc(err)}</p>`:loading?'<p class="ph">Loading the reading…</p>':rows}
  ${cp?`<p class="copy" style="padding:10px 0 0">${esc(cp)}</p>`:''}
  <div class="orn">· ❦ ·</div>
  <div class="wr" id="devwr"><div class="whead"><span class="dlab" style="flex:1">Your notes</span><button class="tpill" data-act="menu" data-m="dtpl">${esc((DTPL[tmpl]||DTPL.inductive).n)} ▾</button></div>
   <div class="devnotes" id="devnotes" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Your notes">${devNotesHtml(st.outline)}</div>
   <div class="done"><span class="hint2">Select words to highlight, underline or comment; comments appear beside the verse</span><button class="dbtn" data-act="ddone">${st.dev.done?'Close':'Done'}</button></div></div>
 </div>
 <div class="dctl${ui.devCtl?' show':''}" id="dctl"><button class="cb" data-act="dexit">${ic('chevL',16)}Today</button><span class="sp"></span><button class="cb aa2" data-act="txt" aria-label="Text and light">Aa</button><button class="cb" data-act="menu" data-m="dmore" aria-label="More">${ic('more',16)}</button></div>
 ${LS.get('devHint',0)?'':'<div class="dhint" id="dhint">Tap to show controls</div>'}</div>`;
 return {bar:'',body};
}
/* iPad: line each comment up with its own verse, even inside a long paragraph. */
function alignMargin(){
 if(ui.view!=='devmode')return;
 document.querySelectorAll('.dmarg').forEach(col=>{col.querySelectorAll('.mw').forEach(m=>m.style.marginTop='');
  if(!MID.matches)return;
  const top0=col.getBoundingClientRect().top;let bottom=0;
  col.querySelectorAll('.mw').forEach(m=>{const v=col.parentElement.querySelector(`.vtx[data-c="${m.dataset.c}"][data-v="${m.dataset.v}"]`);if(!v)return;
   const rects=v.getClientRects();const vt=(rects[0]||v.getBoundingClientRect()).top-top0;const want=Math.max(0,vt-bottom);m.style.marginTop=want+'px';bottom+=want+m.getBoundingClientRect().height+10;m.style.marginBottom='10px'});
 });
}
function devNotesHtml(outline){
 const html=md(outline||'');
 const box=document.createElement('div');box.innerHTML=html;
 [...box.children].forEach(el=>{if(/^H[2-4]$/.test(el.tagName)){const nx=el.nextElementSibling;if(!nx||/^H[2-4]$/.test(nx.tagName)){const p=document.createElement('p');p.className='hp';p.dataset.hint=HINTS[el.textContent.trim()]||'';p.innerHTML='<br>';el.after(p)}}});
 return box.innerHTML;
}
let devCtlT=0;
function devShowCtl(show){ui.devCtl=show;const c=$('#dctl');if(c)c.classList.toggle('show',show);clearTimeout(devCtlT);if(show)devCtlT=setTimeout(()=>devShowCtl(false),3500);if(!LS.get('devHint',0)){LS.set('devHint',1);const h=$('#dhint');if(h)h.remove()}}
function devExit(){ui.view='devo';setThemeColor(null);closeEd(true);hideBar();closeMenu();render()}
/* Version 1.2 kept devotional entries in mobile-devotional.json; move them into the desktop's readings once. */
async function devMigrate(){
 if(LS.get('devMigrated',0))return;
 const log=S.devo.log||{},ents=Object.entries(log);if(!ents.length){LS.set('devMigrated',1);return}
 const names={observe:'Observe',interpret:'Interpret',apply:'Apply',scripture:'Scripture',observation:'Observation',application:'Application',prayer:'Prayer',notes:''};
 for(const [k,e] of ents){if(devFor(k)||e.b==null)continue;await webBook(e.b);const n=chLen(e.b,e.c)||1;const d=newDev(k,{b:e.b,c1:e.c,v1:1,c2:e.c,v2:n});
  const body=Object.entries(e.f||{}).map(([f,v])=>names[f]?`### ${names[f]}\n${v}\n`:`${v}\n`).join('\n');
  const outline=body||tplOutline(e.tpl==='soap'?'soap':'inductive');
  commit({op:'set',sid:d.id,patch:{outline,dev:{done:true,tmpl:e.tpl==='soap'?'soap':e.tpl==='blank'?'free':'inductive'}}});}
 LS.set('devMigrated',1);
}

/* ---------- settings ---------- */


/* ---------- settings ---------- */
function vSettings(){
 const th=SET.theme;
 return {bar:`${backIcon(ui.back||'studies','Back')}<div class="bt">Settings</div>`,body:`<div class="setup" style="padding-top:16px">
 <div class="lbl">Account</div><div class="card" style="margin-bottom:16px">${account?`<div style="font-weight:600">${esc(S.me||'Signed in')}</div><div style="margin:6px 0 10px">${syncLine()}</div><div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center"><button class="btn" data-act="syncnow">${ic('sync',15)}Sync now</button><button class="quiet" data-act="signout">Sign out</button></div>`:CFG.clientId?`<p style="margin:0 0 10px">Not signed in.</p><button class="btn" data-act="signin">Sign in with Microsoft</button>`:`<p style="margin:0">This site isn’t set up yet. Add the client ID in config.js, or under Advanced below.</p>`}</div>
 <div class="lbl">Devotional translation</div><div class="seg" style="margin-bottom:16px;flex-wrap:wrap">${['web','kjv','esv','net','nkjv'].filter(trAvailable).map(t=>`<button class="${devoTr()===t?'on':''}" data-act="devotr" data-tr="${t}">${trName(t)}</button>`).join('')}</div>
 <div class="lbl">Appearance</div><div class="seg" style="margin-bottom:16px">${[['auto','Automatic'],['light','Light'],['dark','Dark']].map(([k,l])=>`<button class="${th===k?'on':''}" data-act="theme" data-t="${k}">${l}</button>`).join('')}</div>
 <div class="lbl">Bible text keys</div><div class="card" style="margin-bottom:16px"><p style="font-size:13.5px;margin:0 0 6px" class="muted">KJV, WEB and NET need no key. ESV and API.Bible keys load by themselves from the desktop app’s keys.json when it’s in OneDrive; otherwise paste them here. They stay on this device.</p><label class="fld"><span>ESV API key</span><input id="k-esv" value="${esc(SET.esvKey)}" autocapitalize="off" spellcheck="false" autocomplete="off"></label><label class="fld"><span>API.Bible key (NKJV, CSB, NLT)</span><input id="k-ab" value="${esc(SET.abKey)}" autocapitalize="off" spellcheck="false" autocomplete="off"></label><button class="quiet" data-act="savekeys">Save keys</button></div>
 <details class="adv"${CFG.clientId?'':' open'}><summary>Advanced</summary><div class="card" style="margin-top:8px">${acctSeg()}<label class="fld"><span>Application (client) ID</span><input id="cfg-client" value="${esc(CFG.clientId)}" autocapitalize="off" spellcheck="false"><small>${window.MARGINALIA_CONFIG&&window.MARGINALIA_CONFIG.clientId?'Set in config.js on the site.':'Not in config.js; saved on this device only.'}</small></label><label class="fld" id="tenant-fld"${CFG.personal?' hidden':''}><span>Directory (tenant) ID</span><input id="cfg-tenant" value="${esc(CFG.tenant==='organizations'?'':CFG.tenant)}" autocapitalize="off" spellcheck="false"></label><label class="fld"><span>Studies folder</span><input id="cfg-folder" value="${esc(CFG.folder)}" autocapitalize="off" spellcheck="false"><small>The folder that holds “studies”, counted from the top of your OneDrive.</small></label><button class="quiet" data-act="savecfg">Save</button></div></details>
 <div class="lbl">Keyboard</div><div style="margin-bottom:16px"><button class="quiet" data-act="keys">Keyboard shortcuts (⌘/)</button></div>
 <p class="muted" style="font-size:12.5px;margin-top:18px">Marginalia for iPad and phone, version ${VERSION}. Changes you make here are saved into the same study files the desktop app uses. Close a study on the computer before marking it here, or the computer may save over your changes.</p></div>`};
}
const acctSeg=()=>`<div class="lbl" style="margin-top:4px">Account type</div><div class="seg" id="acct" data-v="${CFG.personal?'personal':'work'}"><button class="${CFG.personal?'on':''}" data-act="acct" data-v="personal">Personal (OneDrive)</button><button class="${CFG.personal?'':'on'}" data-act="acct" data-v="work">Work or school</button></div>`;

/* ---------- shell ---------- */
function tabOf(v){return {studies:'Studies',study:'Studies',devo:'Devotional',devoRead:'Devotional'}[v]||''}
function tabsHtml(){const t=tabOf(ui.view);return [['Studies','book','studies'],['Devotional','cal','devo']].map(([l,i,v])=>`<button class="tab${t===l?' on':''}" data-act="nav" data-v="${v}">${ic(i,22)}${l}</button>`).join('')}
let lastKey='';
function render(){
 if(ui.view==='devmode'&&document.activeElement&&(document.activeElement.id==='devnotes'||document.activeElement.id==='enote')){ui.pendRender=true;return}
 ui.pendRender=false;
 if(WIDE.matches&&ui.view==='studies'&&cur())ui.view='study';
 if(ui.view==='study'&&!cur())ui.view='studies';
 const fn={studies:vStudies,study:vStudy,search:vSearch,devo:vDevo,devmode:vDevMode,settings:vSettings}[ui.view]||vStudies;
 const ae=document.activeElement,keepFocus=ae&&ae.id&&(ae.tagName==='INPUT'||ae.tagName==='TEXTAREA')&&!ae.closest('#ed')?{id:ae.id,s:ae.selectionStart,e:ae.selectionEnd}:null;
 const V=fn(),body=$('#body'),key=ui.view+'|'+(ui.view==='devmode'?ui.devSid:ui.sid)+'|'+focusOn(),top=key===lastKey?body.scrollTop:0;
 $('#bar').innerHTML=V.bar;body.innerHTML=V.body;
 const app=$('#app');app.classList.remove('noside');app.classList.toggle('under',SET.nlay==='under');app.classList.toggle('notabs',!!['search','settings'].includes(ui.view)&&!WIDE.matches);app.classList.toggle('devfull',ui.view==='devmode');setThemeColor(ui.view==='devmode'?DEV_BG[devLight()]:null);$('#body').style.background=ui.view==='devmode'?DEV_BG[devLight()]:'';
 if(ui.view!=='study')ui.rpOver=false;
 if(WIDE.matches&&!focusOn())ui.sideOver=false;
 app.classList.toggle('focus',focusOn());app.classList.toggle('sidedock',sideDocked());app.classList.toggle('sideover',!!ui.sideOver);app.classList.toggle('rpdock',rpDocked());app.classList.toggle('rpover',!!ui.rpOver&&ui.view==='study');
 $('#scrim').classList.toggle('show',!!ui.sideOver||(!!ui.rpOver&&!rpDocked()&&ui.view==='study'));
 $('#side').innerHTML=sideHtml();$('#rpanel').innerHTML=rpShown()?rpanelHtml():'';$('#pill').innerHTML=focusOn()?pillHtml():'';$('#pill').classList.toggle('on',focusOn());if(!focusOn())$('#pill').classList.remove('hide');
 body.scrollTop=top;lastKey=key;
 if(keepFocus){const el=document.getElementById(keepFocus.id);if(el&&el!==ae){el.focus();try{el.setSelectionRange(keepFocus.s,keepFocus.e)}catch(e){}}}
 if(!['study','devmode'].includes(ui.view))$('#tx').classList.remove('open');
 if(!['study','devmode'].includes(ui.view)){hideBar();closeEd(true)}
 else if(ui.bar)placeBar();
 if(ui.view==='devmode')requestAnimationFrame(alignMargin);
 if(ui.flashV){const el=document.getElementById('v-'+ui.flashV);ui.flashV=null;if(el){el.scrollIntoView({block:'start'});setTimeout(()=>document.querySelectorAll('.vrow.flash').forEach(x=>x.classList.remove('flash')),1600)}}
}

/* ---------- menus ---------- */
function openMenu(btn,kind){
 const st=cur();const m=$('#menu');let items=[];
 if(kind==='tr'&&st){const tr=studyTr(st),anns=st.annotations||[];
  const list=[...new Set([...(st.translations||[]),'kjv','web','esv','net','nkjv'])].filter(t=>TRS[t]&&TRS[t].src!=='none');
  items=list.map(t=>{const n=anns.filter(a=>(a.spans||[]).some(s=>s.tr===t)).length;return {act:'settr',d:{tr:t},label:trName(t)+(n?` <small>${n} mark${n>1?'s':''}</small>`:''),on:t===tr,off:!trAvailable(t)}})}
 else if(kind==='layout')items=[['verse','Verse by verse'],['para','Paragraphs and poetry']].map(([v,l])=>({act:'tlay',d:{v},label:l,on:curLayout()===v}));
 else if(kind==='nlay')items=[['margin','Margin','Notes beside the text'],['under','Under','Notes under each verse']].map(([v,l,h])=>({act:'nlay',d:{v},label:`${l} <small>${h}</small>`,on:(SET.nlay||'margin')===v}));
 else if(kind==='dtpl'&&st){const curT=st.dev&&DTPL[st.dev.tmpl]?st.dev.tmpl:LS.get('devTpl','inductive');items=Object.entries(DTPL).map(([k,t])=>({act:'dtplset',d:{t:k},label:t.n,on:k===curT}))}
 else if(kind==='dmore'){items=[{act:'dmargin',d:{v:SET.devMargin===false?'1':'0'},label:SET.devMargin===false?'Show comments':'Hide comments',icon:'comment'},{hr:1},{act:'dexit',d:{},label:'Back to today',icon:'chevL'}]}
 if(kind==='card'){const a=findAnn(btn.dataset.id);if(!a)return;const lbl=(KLABEL[a.kind]||'mark').toLowerCase(),id=esc(a.id);const tags=a.tags||[];const cur=a.titleTag||tags[0];
  items=[{act:'cedit',d:{id:a.id},label:'Edit note',icon:'pencil'}];
  if(tags.length>1)tags.forEach(t=>items.push({act:'cpin',d:{id:a.id,t},label:'Pin #'+esc(t)+' as the title',icon:'pin',on:t===cur}));
  items.push({hr:1});
  if(a.kind==='note')items.push({act:'cdelmark',d:{id:a.id},label:'Delete the comment',icon:'trash',red:1});
  else{if(a.note)items.push({act:'cdelnote',d:{id:a.id},label:`Delete the note <small>keeps the ${esc(lbl)}</small>`,icon:'note'});items.push({act:'cdelmark',d:{id:a.id},label:a.note?`Delete the ${esc(lbl)} and note`:`Delete the ${esc(lbl)}`,icon:'trash',red:1})}
 }
 if(kind==='dtplh'){const tk=dkey(new Date()),d=devFor(tk),curT=d&&d.dev&&DTPL[d.dev.tmpl]?d.dev.tmpl:LS.get('devTpl','inductive');items=Object.entries(DTPL).map(([k,t])=>({act:'dtplhome',d:{t:k},label:t.n,on:k===curT}))}
 const heads={tr:'Translation',layout:'Layout',nlay:'Notes',dtpl:'Template',dtplh:'Template',dmore:'Reading'};
 if(kind==='fmore'){m.innerHTML=`<div class="mgrid"><button data-act="sideopen" data-t="Studies">${ic('book',20)}Studies</button><button data-act="nav" data-v="devo">${ic('cal',20)}Devotional</button><button data-act="nav" data-v="search">${ic('search',20)}Search</button><button data-act="rpopen" data-t="guide">${ic('guide',20)}Guide</button></div><div class="mhr"></div><button class="mi" data-act="fold"><span class="ck">${ic('collapse',16)}</span><span>${SET.fold!==false?'Expand notes':'Collapse notes'}</span></button><button class="mi" data-act="nav" data-v="settings"><span class="ck">${ic('sliders',16)}</span><span>Settings</span></button><div class="mhr"></div><button class="mi on" data-act="focus"><span class="ck">${ic('unfocus',16)}</span><span>Leave Focus <small>everything back</small></span></button>`}
 else if(kind==='filter'&&st){m.innerHTML=filterPane(st)}else m.innerHTML=(heads[kind]?`<div class="msec">${heads[kind]}</div>`:'')+items.map(it=>it.hr?'<div class="mhr"></div>':`<button class="mi${it.on?' on':''}${it.off?' off':''}${it.red?' red':''}" data-act="${it.act}" ${Object.entries(it.d).map(([k,v])=>`data-${k}="${esc(v)}"`).join(' ')}><span class="ck">${it.icon?ic(it.icon,16):it.on?ic('check',15):''}</span><span>${it.label}</span></button>`).join('')+(kind==='layout'?`<div class="mhr"></div><button class="mi" data-act="txt"><span class="ck"></span><span>Text size, font and spacing…</span></button>`:'');
 m.dataset.k=kind;
 const sheet=!MID.matches&&(kind==='card'||kind==='filter');m.classList.toggle('asSheet',sheet);$('#scrim').classList.toggle('show',sheet);
 m.classList.add('open');
 if(sheet)return;
 const r=btn.getBoundingClientRect(),w=m.offsetWidth||220;
 const h=m.offsetHeight||200;m.style.top=(btn.closest('#pill')?Math.max(8,r.top-h-8):Math.min(r.bottom+6,innerHeight-h-12))+'px';
 m.style.left=Math.max(8,Math.min(btn.closest('#pill')?r.left+r.width/2-w/2:r.left,innerWidth-w-8))+'px';
}
function refreshFilter(){const m=$('#menu');if(m.classList.contains('open')&&m.dataset.k==='filter'&&cur())m.innerHTML=filterPane(cur())}
const closeMenu=()=>{$('#menu').classList.remove('open','asSheet');const sc=$('#scrim');if(sc)sc.classList.remove('show')};

/* ---------- the colors by the selection ---------- */
const bar=$('#mbar');
['pointerdown','mousedown'].forEach(ev=>bar.addEventListener(ev,e=>e.preventDefault()));
let selT=0,warned=false;
document.addEventListener('selectionchange',()=>{clearTimeout(selT);selT=setTimeout(readSel,140)});
const vtxOf=n=>{const el=n&&(n.nodeType===3?n.parentElement:n);return el&&el.closest?el.closest('.vtx'):null};
function offIn(root,node,off){const r=document.createRange();r.setStart(root,0);r.setEnd(node,off);return r.toString().length}
function readSel(){
 if(!((ui.view==='study'&&ui.tab==='passage')||ui.view==='devmode'))return;
 const s=getSelection();
 if(s&&s.anchorNode&&s.anchorNode.parentElement&&s.anchorNode.parentElement.closest&&s.anchorNode.parentElement.closest('#devnotes'))return;
 if(!s||!s.rangeCount||s.isCollapsed){ui.sel=null;if(ui.bar&&ui.bar.mode==='new')hideBar();return}
 if(s.anchorNode&&s.anchorNode.parentElement&&s.anchorNode.parentElement.closest('#ed'))return;
 const r=s.getRangeAt(0),a=vtxOf(r.startContainer),b=vtxOf(r.endContainer);
 if(!a||a!==b){ui.sel=null;if(ui.bar&&ui.bar.mode==='new')hideBar();if((a||b)&&!warned){warned=true;toast('Select words within one verse')}return}
 const txt=a.textContent;let st=offIn(a,r.startContainer,r.startOffset),en=offIn(a,r.endContainer,r.endOffset);
 while(st<en&&/\s/.test(txt[st]))st++;while(en>st&&/\s/.test(txt[en-1]))en--;
 if(en<=st){ui.sel=null;return}
 ui.sel={p:a.dataset.p,c:+a.dataset.c,v:+a.dataset.v,s:st,e:en,w:txt.slice(st,en)};
 if(ui.edit)closeEd();
 ui.barMore=false;ui.bar={mode:'new'};showBar(r.getBoundingClientRect?r.getBoundingClientRect():a.getBoundingClientRect());
}
function barHtml(){
 const a=ui.bar&&ui.bar.mode==='edit'?findAnn(ui.bar.id):null;
 const curCol=a&&a.kind==='highlight'?String(a.color).toLowerCase():null;
 const kinds=[['underline','underline','Underline'],['circle','circle','Circle'],['note','note','Comment']];
 const dev=ui.view==='devmode';
 if(dev){const kinds2=[['underline','underline','Underline'],['note','note','Comment']];return `${[3,2,0,1].map(i=>{const c=PALETTE[i];return `<button class="sw${curCol===c?' on':''}" style="background:${c}" data-act="bcolor" data-c="${i}" aria-label="${curCol===c?'Remove highlight':'Highlight'}"></button>`}).join('')}<span class="dv"></span>${kinds2.map(([k,i,l])=>`<button class="tb2${a&&a.kind===k?' on':''}" data-act="bkind" data-k="${k}" aria-label="${l}" title="${l}">${ic(i,18)}</button>`).join('')}${a?`<span class="dv"></span><button class="tb2" data-act="bnote" aria-label="Write a note" title="Note">${ic('pencil',17)}</button><button class="tb2" data-act="bdel" aria-label="Delete" title="Delete">${ic('trash',17)}</button>`:''}`}
 return `${PALETTE.map((c,i)=>`<button class="sw${curCol===c?' on':''}" style="background:${c}" data-act="bcolor" data-c="${i}" aria-label="${curCol===c?'Remove highlight':'Highlight, color '+(i+1)}"></button>`).join('')}<span class="dv"></span>${ui.barMore?kinds.map(([k,i,l])=>`<button class="tb2${a&&a.kind===k?' on':''}" data-act="bkind" data-k="${k}" aria-label="${a&&a.kind===k?'Remove '+l.toLowerCase():l}" title="${l}">${ic(i,18)}</button>`).join(''):`<button class="more" data-act="bmore" aria-label="Underline, circle or comment" title="Underline, circle, comment">•••</button>`}${a?`<span class="dv"></span><button class="tb2" data-act="bnote" aria-label="Write a note" title="Note">${ic('pencil',17)}</button><button class="tb2" data-act="bdel" aria-label="Delete this mark" title="Delete">${ic('trash',17)}</button>`:''}`;
}
function showBar(rect){ui.bar.rect={top:rect.top,bottom:rect.bottom,left:rect.left,width:rect.width};bar.innerHTML=barHtml();bar.classList.add('show');placeBar()}
function placeBar(){
 if(!ui.bar||!ui.bar.rect)return;
 if(ui.bar.mode==='edit'){const el=document.querySelector(`.vtx [data-m="${String(ui.bar.id).replace(/["\\]/g,'\\$&')}"]`);if(!el){hideBar();return}const r=el.getBoundingClientRect();ui.bar.rect={top:r.top,bottom:r.bottom,left:r.left,width:r.width}}
 const r=ui.bar.rect,w=bar.offsetWidth||300,h=bar.offsetHeight||46,gap=12;
 const foot=MID.matches?16:84;
 let top=r.bottom+gap,up=false;
 if(top+h>innerHeight-foot){top=r.top-h-gap;up=true}
 const cx=r.left+r.width/2,left=Math.max(8,Math.min(cx-w/2,innerWidth-w-8));
 bar.style.top=top+'px';bar.style.left=left+'px';bar.classList.toggle('up',up);
 bar.style.setProperty('--px',Math.max(14,Math.min(w-14,cx-left))+'px');
}
function hideBar(){ui.bar=null;ui.barMore=false;bar.classList.remove('show','up')}
const newId=()=>'a_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const findAnn=id=>{const st=cur();return st&&(st.annotations||[]).find(a=>a.id===id)};
function applyMark(kind,ci){
 const sl=ui.sel,st=cur();if(!sl||!st)return;
 if(ci!=null)ui.color=ci;
 const p=(st.passages||[]).find(x=>x.id===sl.p);if(!p)return;
 const a={id:newId(),kind,color:kind==='note'?'#5b8afe':PALETTE[ui.color],spans:[{tr:studyTr(st),b:p.ref.b,c:sl.c,v:sl.v,s:sl.s,e:sl.e,text:sl.w}],note:'',tags:[],created:new Date().toISOString()};
 commit({op:'add',sid:st.id,a});
 try{getSelection().removeAllRanges()}catch(e){}
 ui.sel=null;hideBar();clearOwnSel();if(ui.view==='devmode'&&kind==='note')ui.justMade=a.id;openEd(a.id);
}
function removeAnn(a){
 const st=cur();const copy=JSON.parse(JSON.stringify(a));
 commit({op:'del',sid:st.id,id:a.id});hideBar();closeEd(true);render();
 toast(`${KLABEL[a.kind]||'Mark'} removed`,()=>{commit({op:'add',sid:st.id,a:copy});render()});
}
function markTap(id,el){
 const a=findAnn(id);if(!a)return;
 ui.barMore=!['highlight'].includes(a.kind);ui.bar={mode:'edit',id};showBar(el.getBoundingClientRect());
 if(document.getElementById('c-'+id)){ui.flash=id;const c=document.getElementById('c-'+id);if(c){c.classList.add('flash');c.scrollIntoView({block:'nearest',behavior:'smooth'})}setTimeout(()=>{if(ui.flash===id){ui.flash=null;const e=document.getElementById('c-'+id);if(e)e.classList.remove('flash')}},1600)}
}

/* ---------- note editor (formatted as you type) ---------- */
function htmlToMd(root){
 let out='';
 const walk=n=>{
  if(n.nodeType===3){out+=n.nodeValue.replace(/\u00a0/g,' ');return}
  if(n.nodeType!==1)return;const t=n.tagName;
  if(t==='BR'){out+='\n';return}
  const block=/^(DIV|P|LI|BLOCKQUOTE|UL|OL|H[1-6])$/.test(t);
  if(block&&out&&!out.endsWith('\n'))out+='\n';
  if(t==='LI'){const ol=n.parentElement&&n.parentElement.tagName==='OL';out+=ol?([...n.parentElement.children].indexOf(n)+1)+'. ':'- '}
  if(t==='BLOCKQUOTE')out+='> ';
  if(/^H[1-6]$/.test(t))out+='#'.repeat(Math.max(1,Math.min(3,+t[1]-1)))+' ';
  const w=(t==='B'||t==='STRONG')?'**':(t==='I'||t==='EM')?'*':t==='MARK'?'==':'';
  if(w){const inner=document.createElement('div');let save=out;out='';n.childNodes.forEach(walk);const s=out;out=save;const m=s.match(/^(\s*)([\s\S]*?)(\s*)$/);out+=m[2]?m[1]+w+m[2]+w+m[3]:s;return}
  n.childNodes.forEach(walk);
  if(block&&!out.endsWith('\n'))out+='\n';
 };
 root.childNodes.forEach(walk);
 return out.replace(/\n{3,}/g,'\n\n').replace(/\s+$/,'');
}
function openEd(id){hideBar();ui.edit=id;ui.unfold.add(id);render();renderEd();const n=$('#enote');if(n){n.focus();try{const r=document.createRange();r.selectNodeContents(n);r.collapse(false);const s=getSelection();s.removeAllRanges();s.addRange(r)}catch(e){}}}
function renderEd(){
 const ed=$('#ed');const a=ui.edit&&findAnn(ui.edit);
 if(!a||ui.view==='devmode'){ed.classList.remove('open');ed.innerHTML='';return}
 const st=cur(),tag=a.titleTag||(a.tags||[])[0],col=(tag&&st.tagColors&&st.tagColors[tag])||okHex(a.color);
 const words=(a.spans||[]).map(s=>s.text).filter(Boolean).join(' … ');
 const mine=a.tags||[],others=allTags().filter(t=>!mine.includes(t));
 const look=a.kind==='above'||a.kind==='connect'?`<div class="elook">${a.kind==='above'?`<label class="efld"><span>Words above</span><input id="eabove" value="${esc(a.above||'')}" autocomplete="off" autocapitalize="off" spellcheck="false"></label>`:''}<div class="erow">${PALETTE.map((c,i)=>`<button class="sw${String(a.color).toLowerCase()===c?' on':''}" style="background:${c}" data-act="ecol" data-c="${i}" aria-label="Color ${i+1}"></button>`).join('')}</div>${a.kind==='connect'?`<div class="seg" style="margin-top:8px">${[['dotted','Dotted'],['dashed','Dashed'],['solid','Solid']].map(([v,l])=>`<button class="${((a.line&&a.line.style)||'dashed')===v?'on':''}" data-act="eline" data-v="${v}">${l}</button>`).join('')}</div><div class="etip" style="margin-top:6px">The line itself is drawn on the computer; here it shows under both words.</div>`:''}</div>`:'';
 ed.innerHTML=`<div class="grab"></div><div class="ehead"><span class="nt" style="color:${col}">${esc(tag||KLABEL[a.kind]||'Note')}</span><em>${esc(words)}</em></div>${look}<div class="enote" id="enote" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Note" data-ph="Write a note">${a.note?md(a.note):''}</div><div class="etags">${mine.map(t=>`<button class="etag on${t===tag?' pin':''}" data-act="etag" data-t="${esc(t)}" title="${t===tag?'Title of this note':'Tap to remove'}">${t===tag?ic('pin',12):''}#${esc(t)}</button>`).join('')}${others.slice(0,8).map(t=>`<button class="etag" data-act="etag" data-t="${esc(t)}">#${esc(t)}</button>`).join('')}<input class="tagin" id="etagin" placeholder="+ tag" enterkeyhint="done" autocomplete="off" aria-label="New tag"></div><div class="etip">Tap outside to finish. Select words for Bold and Italic.</div>`;
 ed.classList.add('open');$('#tx').classList.remove('open');
 if(!MID.matches)fitEd();
}
function closeEd(quiet){if(!ui.edit)return;const id=ui.edit;ui.edit=null;{const ae=document.activeElement;if(ae&&ae.id==='enote')ae.blur()}$('#ed').classList.remove('open');$('#ed').innerHTML='';if(ui.justMade===id){ui.justMade=null;const a=findAnn(id);if(a&&!String(a.note||'').trim())commit({op:'del',sid:cur().id,id})}if(!quiet)render();return id}
function fmtText(ta,k){
 const s=ta.selectionStart,e=ta.selectionEnd,v=ta.value,t={b:'**',i:'*'}[k],sel=v.slice(s,e),L=t.length;
 if(v.slice(s-L,s)===t&&v.slice(e,e+L)===t){ta.value=v.slice(0,s-L)+sel+v.slice(e+L);ta.setSelectionRange(s-L,e-L)}
 else{ta.value=v.slice(0,s)+t+sel+t+v.slice(e);ta.setSelectionRange(s+L,e+L)}
 ta.dispatchEvent(new Event('input',{bubbles:true}));
}

/* ---------- toast & theme ---------- */
let tT=0;
function toast(msg,fn,lbl){const t=$('#toast');t.innerHTML=`<span>${esc(msg)}</span>${fn?`<button id="tundo">${lbl||'Undo'}</button>`:''}`;t.classList.add('show');clearTimeout(tT);tT=setTimeout(()=>t.classList.remove('show'),lbl?15000:fn?5000:2600);if(fn)$('#tundo').onclick=()=>{fn();t.classList.remove('show')}}
function applyTheme(){const r=document.documentElement;if(SET.theme==='auto')delete r.dataset.theme;else r.dataset.theme=SET.theme}

/* ---------- actions ---------- */
const A={
 side:()=>{SET.side=!sideOpen();saveSet();render()},
 nav:el=>{ui.sideOver=false;ui.rpOver=false;closeSheet();clearOwnSel();const v=el.dataset.v;if(['search','settings'].includes(v)&&!['search','settings'].includes(ui.view))ui.back=ui.view;closeEd(true);hideBar();closeMenu();ui.view=v;render();if(v==='search'&&MID.matches){const q=$('#q');if(q)q.focus()}},
 open:el=>{ui.sideOver=false;ui.sideTab=null;clearOwnSel();ui.sid=el.dataset.s;ui.view='study';ui.tab='passage';fsReset();closeEd(true);hideBar();ui.sumOpen=false;ui.unfold.clear();lastKey='';render()},
 tab:el=>{ui.tab=el.dataset.t;closeEd(true);hideBar();render()},
 menu:el=>{const m=$('#menu');if(m.classList.contains('open')&&m.dataset.k===el.dataset.m){closeMenu();return}m.dataset.k=el.dataset.m;openMenu(el,el.dataset.m)},
 ftog:el=>{const g=FS[el.dataset.g],v=el.dataset.v;if(g.has(v))g.delete(v);else g.add(v);ui.fdelArm=false;render();refreshFilter()},
 fjust:()=>{FS.just=!FS.just;ui.fdelArm=false;render();refreshFilter()},
 fclear:()=>{fsReset();render();refreshFilter()},
 fdel:()=>{const st=cur();if(!st)return;const del=(st.annotations||[]).filter(annMatch);if(!del.length)return;if(!ui.fdelArm){ui.fdelArm=true;refreshFilter();return}ui.fdelArm=false;const copies=JSON.parse(JSON.stringify(del));del.forEach(a=>commit({op:'del',sid:st.id,id:a.id}));fsReset();closeMenu();render();toast(`${copies.length} mark${copies.length===1?'':'s'} deleted`,()=>{copies.forEach(a=>commit({op:'add',sid:st.id,a}));render()})},
 settr:el=>{const t=el.dataset.tr;closeMenu();if(!trAvailable(t)){toast(`Add the ${TRS[t]&&TRS[t].src==='esv'?'ESV':'API.Bible'} key in Settings to read ${trName(t)}`);return}SET.tr[cur().id]=t;saveSet();hideBar();render()},
 tlay:el=>{closeMenu();setText({layout:el.dataset.v})},
 nlay:el=>{closeMenu();SET.nlay=el.dataset.v;saveSet();render()},
 fold:()=>{SET.fold=!(SET.fold!==false);ui.unfold.clear();saveSet();render()},
 retry:el=>{Object.keys(CHERR).forEach(k=>{if(k.startsWith(el.dataset.tr+'|'))delete CHERR[k]});render()},
 sum:()=>{ui.sumOpen=!ui.sumOpen;render()},
 card:el=>{const id=el.dataset.m;if(ui.edit===id)return;hideBar();if(ui.selCard===id){ui.selCard=null;ui.unfold.delete(id);render();return}ui.selCard=id;ui.unfold.add(id);render()},
 cedit:el=>{closeMenu();openEd(el.dataset.id)},
 cpin:el=>{closeMenu();const a=findAnn(el.dataset.id);if(!a)return;commit({op:'upd',sid:cur().id,id:a.id,patch:{titleTag:el.dataset.t}});render()},
 cdelnote:el=>{closeMenu();const a=findAnn(el.dataset.id);if(!a)return;const old={note:a.note||'',tags:[...(a.tags||[])],titleTag:a.titleTag};const sid=cur().id;commit({op:'upd',sid,id:a.id,patch:{note:''}});ui.selCard=null;render();toast('Note deleted',()=>{commit({op:'upd',sid,id:a.id,patch:{note:old.note}});render()})},
 cdelmark:el=>{closeMenu();const a=findAnn(el.dataset.id);if(!a)return;ui.selCard=null;removeAnn(a)},
 scrim:()=>{closeMenu();closeSheet();if(ui.sideOver||ui.rpOver){ui.sideOver=false;ui.rpOver=false;render()}},
 sidebtn:()=>{if(WIDE.matches&&!focusOn()){SET.side=SET.side===false;saveSet();render();return}ui.sideOver=!ui.sideOver;ui.rpOver=false;render()},
 sideopen:el=>{closeMenu();ui.sideTab=el.dataset.t||null;ui.sideOver=true;ui.rpOver=false;render()},
 sidetab:el=>{ui.sideTab=el.dataset.t;if(el.dataset.t==='Devotional'&&ui.view!=='devo'&&ui.view!=='devmode'&&WIDE.matches&&!ui.sideOver){ui.view='devo';ui.sideTab=null}render()},
 rpbtn:()=>{if(WIDE.matches&&!focusOn()){SET.rp=SET.rp===false;saveSet();ui.rpOver=false}else{ui.rpOver=!ui.rpOver;ui.sideOver=false}render()},
 rpopen:el=>{closeMenu();ui.rpTab=el.dataset.t||'notes';if(!rpDocked())ui.rpOver=true;render()},
 rptab:el=>{ui.rpTab=el.dataset.t;render()},
 rpclose:()=>{ui.rpOver=false;render()},
 focus:()=>{closeMenu();const st=cur();if(!st)return;SET.focus[st.id]=!SET.focus[st.id];if(!SET.focus[st.id])delete SET.focus[st.id];saveSet();ui.sideOver=false;ui.rpOver=false;hideBar();clearOwnSel();render()},
 gtag:el=>{FS.tags.clear();FS.tags.add(el.dataset.t);ui.rpOver=false;render()},
 vnote:el=>{closeMenu();const st=cur();if(!st)return;const p=st.passages.find(x=>x.id===el.dataset.p)||st.passages[0],c=+el.dataset.c,v=+el.dataset.v,tr=studyTr(st);const t=((CH[chKey(tr,p.ref.b,c)]||{v:[]}).v[v-1])||'';const a={id:newId(),kind:'note',color:'#5b8afe',spans:[{tr,b:p.ref.b,c,v,s:0,e:t.length,text:t}],note:'',tags:[],created:new Date().toISOString()};commit({op:'add',sid:st.id,a});ui.justMade=a.id;openEd(a.id)},
 vcopy:el=>{closeMenu();const st=cur();if(!st)return;const p=st.passages.find(x=>x.id===el.dataset.p)||st.passages[0],c=+el.dataset.c,v=+el.dataset.v,tr=studyTr(st);const t=((CH[chKey(tr,p.ref.b,c)]||{v:[]}).v[v-1])||'';const ref=`${bname(p.ref.b,true)} ${c}:${v}`;const txt=el.dataset.ref?ref:`“${t}” ${ref} (${trName(tr)})`;(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast('Copied')).catch(()=>toast('Couldn’t copy here'))},
 devcal:()=>{showSheetHtml(devCalCard()+devPlanCard())},
 goopen:()=>{const i=$('#gopass');const r=parseRef(i&&i.value);if(!r){toast('Type a passage like Romans 8 or John 3:1–21');return}closeSheet();openOneOff(r)},
 gopool:async el=>{const r=await poolPick(el.dataset.p);openOneOff(r)},
 vodctx:()=>vodContext(),
 vodread:()=>{const r=vodRef();closeSheet();if(r)openOneOff({b:r.b,c1:r.c1,v1:1,c2:r.c1,v2:999})},
 sheetx:()=>closeSheet(),
 dtplhome:el=>{closeMenu();const t=el.dataset.t;LS.set('devTpl',t);const d=devFor(dkey(new Date()));if(d&&!devBody(d.outline)){commit({op:'set',sid:d.id,patch:{outline:tplOutline(t),dev:{tmpl:t}}})}render()},
 dstartover:()=>{const d=devFor(dkey(new Date()));if(!d)return;if(!ui.overArm){ui.overArm=true;render();setTimeout(()=>{ui.overArm=false},4000);return}ui.overArm=false;const old={outline:d.outline,annotations:JSON.parse(JSON.stringify(d.annotations||[])),dev:{done:!!d.dev.done}};commit({op:'set',sid:d.id,patch:{outline:tplOutline(d.dev.tmpl||'inductive'),annotations:[],dev:{done:false}}});render();toast('Started over',()=>{commit({op:'set',sid:d.id,patch:old});render()})},
 wnx:()=>$('#wn').classList.remove('open'),
 keys:()=>showShortcuts(),
 bdel:()=>{const a=ui.bar&&findAnn(ui.bar.id);if(a)removeAnn(a)},
 bcolor:el=>{const i=+el.dataset.c,c=PALETTE[i];if(ui.bar.mode==='new'){applyMark('highlight',i);return}const a=findAnn(ui.bar.id);if(!a)return;if(a.kind==='highlight'&&String(a.color).toLowerCase()===c){removeAnn(a);return}ui.color=i;commit({op:'upd',sid:cur().id,id:a.id,patch:{kind:'highlight',color:c}});render();bar.innerHTML=barHtml()},
 bkind:el=>{const k=el.dataset.k;if(ui.bar.mode==='new'){applyMark(k,null);return}const a=findAnn(ui.bar.id);if(!a)return;if(a.kind===k){removeAnn(a);return}commit({op:'upd',sid:cur().id,id:a.id,patch:{kind:k}});render();bar.innerHTML=barHtml()},
 bmore:()=>{ui.barMore=true;bar.innerHTML=barHtml();placeBar()},
 bnote:()=>{const id=ui.bar&&ui.bar.id;if(id)openEd(id)},
 etag:el=>{const st=cur(),a=findAnn(ui.edit);if(!a)return;const t=el.dataset.t,has=(a.tags||[]).includes(t);const tags=has?a.tags.filter(x=>x!==t):[...(a.tags||[]),t];const patch={tags};if(has&&a.titleTag===t)patch.titleTag=tags[0]||'';commit({op:'upd',sid:st.id,id:a.id,patch});render();renderEd()},
 txt:()=>{closeEd(true);hideBar();const x=$('#tx');if(x.classList.contains('open')){x.classList.remove('open');return}x.innerHTML=txtHtml();x.classList.add('open')},
 txtx:()=>$('#tx').classList.remove('open'),
 tfont:el=>setText({font:el.dataset.k}),
 tsize:el=>setText({size:Math.max(.8,Math.min(1.6,Math.round((tset().size+(+el.dataset.d)*.05)*100)/100))}),
 tlh:el=>setText({lh:el.dataset.v}),
 tvn:el=>setText({vn:el.dataset.v==='1'}),
 treset:()=>{LS.set('text',{...TDEF});applyText();render();$('#tx').innerHTML=txtHtml()},
 theme:el=>{SET.theme=el.dataset.t;saveSet();applyTheme();render()},
 syncinfo:()=>{const s=syncInfo();toast(s.msg,account?()=>sync(true):null,account?'Sync now':null)},
 signin:()=>signIn(),
 signout:()=>signOut(),
 syncnow:()=>sync(true),
 acct:el=>{const g=$('#acct');g.dataset.v=el.dataset.v;g.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===el));const t=$('#tenant-fld');if(t)t.hidden=el.dataset.v!=='work'},
 savecfg:()=>{const c=$('#cfg-client'),f=$('#cfg-folder'),tn=$('#cfg-tenant'),ac=$('#acct');const n={...LS.get('cfg',{})};if(ac)n.account=ac.dataset.v;if(c)n.clientId=c.value.trim();if(tn)n.tenant=tn.value.trim()||'organizations';if(f)n.folder=f.value.trim().replace(/^\/+|\/+$/g,'')||'Documents/Marginalia';LS.set('cfg',n);toast('Saved');setTimeout(()=>location.reload(),400)},
 savekeys:()=>{SET.esvKey=$('#k-esv').value.trim();SET.abKey=$('#k-ab').value.trim();saveSet();Object.keys(CHERR).forEach(k=>delete CHERR[k]);toast('Keys saved');render()},
 devotr:el=>{SET.devoTr=el.dataset.tr;saveSet();render()},
 start:()=>devStart(dkey(new Date())),
 another:async()=>{const tk=dkey(new Date()),d=devFor(tk);ui.another++;if(d&&!devTouched(d)){const ref=await devPick(tk,ui.another);await webBook(ref.b);const p=d.passages[0];commit({op:'set',sid:d.id,patch:{passages:[{...p,ref}],title:devTitle(ref)}})}render()},
 cal:el=>{let [y,m]=ui.cal;m+=+el.dataset.d;if(m<0){m=11;y--}if(m>11){m=0;y++}ui.cal=[y,m];render()},
 day:el=>{const k=el.dataset.d,tk=dkey(new Date()),d=devFor(k);if(d){devOpen(d.id);return}if(kdate(k)>new Date()){toast('That day hasn’t come yet');return}if((S.devo.log||{})[k]&&!account){toast('Sign in to open that reading');return}devStart(k)},
 devopen:el=>devOpen(el.dataset.s,el.dataset.notes==='1'),
 dexit:()=>{closeMenu();devExit()},
 ddone:()=>{const st=cur();if(!st)return;const was=st.dev.done;if(!was)commit({op:'set',sid:st.id,patch:{dev:{done:true}}});devExit();if(!was)toast('Done. Well read.')},
 dtplset:el=>{closeMenu();const st=cur();if(!st)return;const t=el.dataset.t;LS.set('devTpl',t);const have=new Set(String(st.outline||'').split('\n').filter(l=>/^#{1,6}\s/.test(l)).map(l=>l.replace(/^#+\s*/,'').trim()));const add=(DTPL[t]||DTPL.inductive).h.filter(([h])=>!have.has(h)).map(([h])=>`### ${h}\n`).join('\n');const outline=(String(st.outline||'').replace(/\s+$/,'')+(add?'\n\n'+add:'')).replace(/^\s+/,'');commit({op:'set',sid:st.id,patch:{outline,dev:{tmpl:t}}});render()},
 dbub:()=>{SET.devBub=SET.devBub===false;saveSet();closeMenu();render();const x=$('#tx');if(x.classList.contains('open'))x.innerHTML=txtHtml()},
 dmargin:el=>{SET.devMargin=el&&el.dataset&&el.dataset.v!=null?el.dataset.v==='1':SET.devMargin===false;saveSet();closeMenu();render();const x=$('#tx');if(x.classList.contains('open'))x.innerHTML=txtHtml()},
 dlight:el=>{SET.devLight=el.dataset.v;saveSet();render();const x=$('#tx');if(x.classList.contains('open'))x.innerHTML=txtHtml()},
 vwrite:el=>{const st=cur();if(!st)return;const p=st.passages[0],tr=(st.translations||[])[0]||devoTr(),c=+el.dataset.c,v=+el.dataset.v;const ex=(st.annotations||[]).find(a=>a.kind==='note'&&(a.spans||[]).some(sp=>sp.tr===tr&&sp.c===c&&sp.v===v&&sp.s<=0&&sp.e>=((CH[chKey(tr,p.ref.b,c)]||{v:[]}).v[v-1]||'').replace(/\s+$/,'').length-1));if(ex){openEd(ex.id);return}const t=((CH[chKey(tr,p.ref.b,c)]||{v:[]}).v[v-1])||'';const a={id:newId(),kind:'note',color:'#5bba88',spans:[{tr,b:p.ref.b,c,v,s:0,e:t.length,text:t}],note:'',tags:[],created:new Date().toISOString()};commit({op:'add',sid:st.id,a});ui.justMade=a.id;openEd(a.id)},
 mwedit:el=>openEd(el.dataset.id),
 ecol:el=>{const st=cur(),a=findAnn(ui.edit);if(!a)return;commit({op:'upd',sid:st.id,id:a.id,patch:{color:PALETTE[+el.dataset.c]}});render();renderEd()},
 eline:el=>{const st=cur(),a=findAnn(ui.edit);if(!a)return;commit({op:'upd',sid:st.id,id:a.id,patch:{line:{...(a.line||{}),style:el.dataset.v}}});render();renderEd()},
 bub:el=>openEd(el.dataset.id),
 goto:el=>{ui.sid=el.dataset.s;const st=cur();if(st&&el.dataset.tr&&TRS[el.dataset.tr]){SET.tr[st.id]=el.dataset.tr;saveSet()}ui.view='study';ui.tab='passage';fsReset();if(el.dataset.m)ui.unfold.add(el.dataset.m);ui.flashV=`${el.dataset.p}-${el.dataset.c}-${el.dataset.v}`;lastKey='';render()},
 gonotes:el=>{ui.sid=el.dataset.s;ui.view='study';ui.tab='passage';ui.rpTab='notes';if(!rpDocked())ui.rpOver=true;lastKey='';render()}
};
document.addEventListener('click',e=>{
 const inMenu=e.target.closest('#menu'),inEd=e.target.closest('#ed')||e.target.closest('.mw.editing'),inBar=e.target.closest('#mbar');
 if(!inMenu&&!e.target.closest('[data-act=menu]'))closeMenu();
 const a=e.target.closest('[data-act]');
 if(ui.selCard&&!e.target.closest('.nc.sel')&&!inMenu&&!(a&&a.dataset.act==='card')){ui.selCard=null;if(ui.view==='study'){const c=document.querySelector('.nc.sel');if(c)render()}}
 if(ui.edit&&!inEd&&!inBar&&!(a&&a.dataset.act==='card'&&a.dataset.m===ui.edit)){closeEd()}
 if(a){if(a.disabled)return;const f=A[a.dataset.act];if(f){f(a,e);return}}
 const m=e.target.closest('.vtx [data-m]');
 if(m){const s=getSelection();if(s&&!s.isCollapsed)return;markTap(m.dataset.m,m);return}
 if(ui.bar&&ui.bar.mode==='edit'&&!inBar)hideBar();
 if(ui.selDrag&&!inBar&&!e.target.closest('#selk')){clearOwnSel();if(ui.bar&&ui.bar.mode==='new')hideBar()}
 if($('#tx').classList.contains('open')&&!e.target.closest('#tx')){$('#tx').classList.remove('open');return}
if(focusOn()&&!inMenu&&!e.target.closest('#pill,button,.nc,.vtx [data-m],#mbar')){const p=$('#pill');if(p)p.classList.remove('hide')}
 if(ui.view==='devmode'&&!inMenu&&!inBar&&!inEd&&!e.target.closest('#tx,.vtx,.mw,.copen,#devnotes,.dctl,button,input,a')){const s=getSelection();if(!s||s.isCollapsed)devShowCtl(!ui.devCtl)}
});
document.addEventListener('input',e=>{
 const t=e.target;
 if(t.id==='devnotes'){t.querySelectorAll('p.hp').forEach(x=>{if(x.textContent.trim())x.classList.remove('hp')});const st=cur();if(st)commit({op:'set',sid:st.id,patch:{outline:htmlToMd(t)}})}
 else if(t.id==='eabove'){const st=cur();if(st&&ui.edit){commit({op:'upd',sid:st.id,id:ui.edit,patch:{above:t.value}});const m=document.querySelector(`.vtx [data-m="${ui.edit}"]`);if(m)m.dataset.above=t.value}}
 else if(t.id==='enote'){if(ui.view==='devmode')alignMargin();const st=cur();if(st&&ui.edit)commit({op:'upd',sid:st.id,id:ui.edit,patch:{note:htmlToMd(t)}})}
 else if(t.id==='q'){ui.q=t.value;$('#res').innerHTML=results()}
 else if(t.id==='tsz'){LS.set('text',Object.assign(tset(),{size:+t.value}));applyText();$('#tszv').textContent=Math.round(t.value*100)+'%'}
 else if(t.dataset&&t.dataset.f&&ui.dr){ui.dr.f[t.dataset.f]=t.value}
});
document.addEventListener('keydown',e=>{
 if(e.target.id==='gopass'&&e.key==='Enter'){e.preventDefault();A.goopen();return}
 if(e.target.id==='etagin'&&e.key==='Enter'){e.preventDefault();const v=e.target.value.trim().replace(/^#/,'');if(!v)return;const st=cur(),a=findAnn(ui.edit);if(a&&!(a.tags||[]).includes(v))commit({op:'upd',sid:st.id,id:a.id,patch:{tags:[...(a.tags||[]),v]}});render();renderEd();const n=$('#etagin');if(n)n.focus();return}
 if((e.ctrlKey||e.metaKey)&&['b','i'].includes(e.key.toLowerCase())){
  if(e.target.id==='enote'){e.preventDefault();document.execCommand(e.key.toLowerCase()==='b'?'bold':'italic');e.target.dispatchEvent(new Event('input',{bubbles:true}));return}
  if(e.target.tagName==='TEXTAREA'){e.preventDefault();fmtText(e.target,e.key.toLowerCase());return}
 }
 if((e.ctrlKey||e.metaKey)&&e.key==='Enter'&&e.target.id==='enote'){e.preventDefault();closeEd();return}
 if(e.key==='Enter'&&e.target.classList&&e.target.classList.contains('nc')){A.card(e.target);return}
 if(e.key==='Escape'){if($('#menu').classList.contains('open'))closeMenu();else if($('#tx').classList.contains('open'))$('#tx').classList.remove('open');else if(ui.edit)closeEd();else if(ui.bar)hideBar();else if(ui.view==='devmode'&&!/INPUT|TEXTAREA/.test(e.target.tagName)&&e.target.id!=='devnotes')devExit();else if($('#wn').classList.contains('open'))$('#wn').classList.remove('open')}
});
let lastTop=0;
$('#body').addEventListener('scroll',()=>{const b=$('#body');if(focusOn()){const p=$('#pill');if(p){if(b.scrollTop<=24)p.classList.remove('hide');else if(Math.abs(b.scrollTop-lastTop)>2)p.classList.add('hide')}}lastTop=b.scrollTop;if(ui.selDrag)drawSel();if(ui.bar)placeBar();closeMenu();if(ui.view==='devmode'){const b=$('#body'),pr=$('#dprog');if(pr)pr.style.width=Math.min(100,b.scrollTop/Math.max(1,b.scrollHeight-b.clientHeight)*100)+'%'}},{passive:true});
document.addEventListener('focusout',e=>{if(e.target&&(e.target.id==='devnotes'||e.target.id==='enote')&&ui.pendRender)setTimeout(()=>{if(document.activeElement.id!=='enote'&&document.activeElement.id!=='devnotes')render()},0)});
let swipeX=null;
$('#body').addEventListener('touchstart',e=>{swipeX=ui.view==='devmode'&&e.touches[0].clientX<24?e.touches[0].clientX:null},{passive:true});
$('#body').addEventListener('touchend',e=>{if(swipeX!=null&&e.changedTouches[0].clientX-swipeX>70)devExit();swipeX=null},{passive:true});
function fitEd(){const ed=$('#ed');if(!window.visualViewport||MID.matches){ed.style.bottom='';return}const vv=visualViewport;ed.style.bottom=Math.max(0,innerHeight-vv.height-vv.offsetTop)+'px'}
if(window.visualViewport){visualViewport.addEventListener('resize',fitEd);visualViewport.addEventListener('scroll',fitEd)}
WIDE.addEventListener&&WIDE.addEventListener('change',()=>render());
MID.addEventListener&&MID.addEventListener('change',()=>render());
addEventListener('resize',()=>{if(ui.bar)placeBar();alignMargin()});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>alignMargin());
addEventListener('online',()=>sync());
addEventListener('offline',()=>setStatus(''));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&Date.now()-LS.get('lastSync',0)>60000)sync()});

/* ---------- What's new and keyboard shortcuts ---------- */
const CHANGES={
 '1.4.1':['Focus: the pill hides as soon as you scroll and comes back at the top or when you tap the page; Notes now opens the Study notes in Focus.','The study and the devotional each keep their own Verses / Paragraphs setting.','Notes: the first tap opens a note, the second closes it; edit from ••• > Edit note.','Filter: marks and notes that don’t match are hidden, and the scripture text stays normal.'],
 '1.4.0':['The desktop’s look: the same top bar, sidebar (Studies · Devotional), study page, note cards and right panel (Study notes · Guide), in the desktop’s colors.','Focus: one tap for just the page, with a small pill for what you need while reading; everything else one tap away under ⋯.','Select scripture by pressing and holding a word, then dragging: no more Copy / Look Up menu. Long-press a verse number for the verse menu.','A new devotional home, like the desktop’s: verse of the day, today’s reading, choose your own passage, past readings and Recent.'],
 '1.3.3':['Devotional: comments now appear beside their verse (in the margin on an iPad, under the verse on a phone), like the desktop’s writing beside the text. Select words and choose Comment: the box opens right there, ready to type.'],
 '1.3.2':['Fixed: menus, Filter, translations and Verses not responding when some app files were from an older version; the app now repairs this itself and tells you if files need uploading again.','Fixed: Paragraphs now works in KJV and other translations without their own paragraph marks.','Fixed: note cards keep the title and marked words on one line and stay inside the notes column.'],
 '1.3.1':['The app now uses the desktop app’s icon. To see it on the Home Screen, remove Marginalia from the Home Screen and add it again (your studies stay in OneDrive).'],
 '1.3.0':['Devotional: the iPad and the computer now share each day’s reading through OneDrive, with the same passage, marks and notes on both.','Devotional mode goes full screen, in the desktop’s morning and evening look. Tap to show ‹ Today, Aa and ⋯; swipe from the left edge to go back.','Write beside a verse by tapping its number; comments fold into small bubbles; one writing area with six templates.','Menus, the Filter and note cards now look and work like the desktop’s: Just the text, types, colors and tags, and Delete these marks.','Words-above and connection marks can be changed here (words, color, line style).','Keyboard shortcuts for an iPad keyboard (⌘/ lists them).'],
 '1.2.1':['Delete a note: tap a note, then ••• (keeps the highlight, or deletes both). Every delete has Undo.','The desktop’s icons throughout.']};
const SHORTCUTS=[['⌘F','Search'],['⌘[  ⌘]','Previous / next study'],['⌘⇧E','Collapse or expand notes'],['⌘⇧L','Filter'],['⌘⇧A','Text settings (Aa)'],['⌘⇧D','Today’s devotional'],['⌘B  ⌘I','Bold, italic in a note'],['⌘↩','Finish a note'],['Esc','Close, or leave the devotional'],['⌘/','This list']];
const cmpV=(a,b)=>{const x=String(a).split('.').map(Number),y=String(b).split('.').map(Number);for(let i=0;i<3;i++){if((x[i]||0)!==(y[i]||0))return (x[i]||0)-(y[i]||0)}return 0};
function showSheet(title,html){const w=$('#wn');w.innerHTML=`<div class="card"><div style="display:flex;align-items:center;margin-bottom:6px"><b style="font-size:17px;flex:1">${title}</b>${ib('x','wnx','Close')}</div>${html}<div style="text-align:right;margin-top:14px"><button class="btn" data-act="wnx">Got it</button></div></div>`;w.classList.add('open')}
function showWhatsNew(from){const vs=Object.keys(CHANGES).filter(v=>cmpV(v,from)>0&&cmpV(v,VERSION)<=0).sort((a,b)=>cmpV(b,a));if(!vs.length)return;showSheet(`What’s new in ${VERSION}`,vs.map(v=>`${vs.length>1?`<div class="msec" style="padding-left:0">${v}</div>`:''}<ul class="wnl">${CHANGES[v].map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`).join(''))}
function showShortcuts(){showSheet('Keyboard shortcuts',`<table class="kbd">${SHORTCUTS.map(([k,l])=>`<tr><td><kbd>${k}</kbd></td><td>${l}</td></tr>`).join('')}</table>`)}
function stepStudy(d){const list=studyList();const i=list.findIndex(s=>s.id===ui.sid);const n=list[(i+d+list.length)%list.length];if(n)A.open({dataset:{s:n.id}})}
document.addEventListener('keydown',e=>{
 if(!(e.metaKey||e.ctrlKey)||e.altKey)return;
 const k=e.key.toLowerCase(),inText=/INPUT|TEXTAREA/.test(e.target.tagName)||e.target.isContentEditable;
 if(k==='f'&&!e.shiftKey){e.preventDefault();A.nav({dataset:{v:'search'}});return}
 if(e.shiftKey&&k==='d'){e.preventDefault();devStart(dkey(new Date()));return}
 if(e.shiftKey&&k==='a'&&['study','devmode'].includes(ui.view)){e.preventDefault();A.txt();return}
 if(e.shiftKey&&k==='e'&&ui.view==='study'){e.preventDefault();A.fold();return}
 if(e.shiftKey&&k==='l'&&ui.view==='study'){e.preventDefault();const b=document.querySelector('[data-act=menu][data-m=filter]');if(b)A.menu(b);return}
 if(!inText&&(k==='['||k===']')&&ui.view==='study'){e.preventDefault();stepStudy(k===']'?1:-1);return}
 if(k==='/'){e.preventDefault();showShortcuts();return}
},true);
/* ===================== 1.4: the desktop's layout, simplified ===================== */
Object.assign(ICO,{
 'mg-side':'<rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor"/><path d="M9 4v16" stroke="currentColor"/>',
 'mg-rside':'<rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor"/><path d="M15 4v16" stroke="currentColor"/>',
 'mg-focus':'<path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.2" stroke="currentColor"/>',
 'mg-unfocus':'<path d="M9 4v4H5M15 4v4h4M9 20v-4H5M15 20v-4h4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
 'mg-notes':'<rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor"/><path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" stroke-linecap="round"/>',
 'mg-calendar':'<rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" stroke-linecap="round"/>'
});
Object.assign(IC_ALIAS,{side:'mg-side',rside:'mg-rside',focus:'mg-focus',unfocus:'mg-unfocus',notesI:'mg-notes',calendar:'mg-calendar',guide:'@guide'});
Object.assign(ui,{sideOver:false,rpOver:false,rpTab:'notes',sideTab:null,selDrag:null});
SET.focus=SET.focus||{};
const focusOn=()=>ui.view==='study'&&!!SET.focus[ui.sid]&&!!cur();
const sideDocked=()=>WIDE.matches&&SET.side!==false&&!focusOn();
const rpDocked=()=>WIDE.matches&&SET.rp!==false&&ui.view==='study'&&!focusOn();
const rpShown=()=>ui.view==='study'&&(rpDocked()||ui.rpOver);

/* ---------- top bar: the desktop's slim bar ---------- */
function topbar(title,opt={}){
 const sideOn=WIDE.matches?sideDocked():ui.sideOver;
 const name=title?`<div class="bt">${title}</div>`:`<div class="bname">Marginalia</div>`;
 return `<button class="ib${sideOn?' on':''}" data-act="sidebtn" aria-label="Sidebar" title="Sidebar">${ic('side',18)}</button>${name}${(account||CFG.clientId)?syncDot():''}<span class="sp"></span>${opt.extra||''}${opt.focus?`<button class="fbtn" data-act="focus" aria-label="Focus" title="Focus: just the page">${ic('focus',17)}<span class="lab">Focus</span></button>`:''}${ib('search','nav','Search','data-v="search"')}${MID.matches?ib('sliders','nav','Settings','data-v="settings"'):''}${opt.rp?`<button class="ib${rpShown()?' on':''}" data-act="rpbtn" aria-label="Study notes and Guide" title="Study notes and Guide">${ic('rside',18)}</button>`:''}`;
}

/* ---------- sidebar: Studies · Devotional, like the desktop's ---------- */
function sideHtml(){
 const t=ui.sideTab||(['devo','devmode'].includes(ui.view)?'Devotional':'Studies');
 const tabs=`<div class="stabs"><button class="${t==='Studies'?'on':''}" data-act="sidetab" data-t="Studies">Studies</button><button class="${t==='Devotional'?'on':''}" data-act="sidetab" data-t="Devotional">Devotional</button></div>`;
 let inner='';
 if(t==='Studies'){
  const list=studyList(),open=ui.view==='study'?cur():null;
  inner=(open?`<div class="scard"><b>${esc(open.title||'Untitled')}</b><small>${esc((open.passages||[]).map(p=>refStr(p.ref)).join(', '))} · ${(open.annotations||[]).length} marks</small>${(open.passages||[]).map(p=>`<div class="pchip">${esc(refStr(p.ref))}</div>`).join('')}</div>`:'')+
   (list.filter(s=>!open||s.id!==open.id).map(s=>`<button class="srow" data-act="open" data-s="${esc(s.id)}">${esc(s.title||'Untitled')}<small>${esc((s.passages||[]).map(p=>refStr(p.ref)).join(', '))}</small></button>`).join('')||(open?'':'<p class="muted" style="padding:4px 8px;font-size:13px">No studies yet.</p>'));
 }else{
  inner=`<button class="srow strong" data-act="nav" data-v="devo">${ic('cal',17)}Today’s reading</button>${devCalCard()}${devPlanCard()}`;
 }
 return `${tabs}<div class="sbody">${inner}</div><div class="sfoot2">${MID.matches?'':`<button class="srow" data-act="nav" data-v="settings">${ic('sliders',16)}Settings</button>`}${syncLine()}</div>`;
}
function devPlanCard(){const n=devList().length;return `<div class="scard"><small style="margin:0">Plan</small><b>Surprise me</b><small>${Object.keys(DEV_POOLS).join(' · ')} · ${n} reading${n===1?'':'s'}</small></div>`}
function devCalCard(){
 const t=new Date(),tk=dkey(t),legacy=S.devo.log||{};if(!ui.cal)ui.cal=[t.getFullYear(),t.getMonth()];
 const [cy,cm]=ui.cal,first=new Date(cy,cm,1),days=new Date(cy,cm+1,0).getDate();
 let cal=`<div class="cal">${['S','M','T','W','T','F','S'].map(d=>`<div class="w">${d}</div>`).join('')}${'<div></div>'.repeat(first.getDay())}`;
 for(let d=1;d<=days;d++){const k=`${cy}-${pad(cm+1)}-${pad(d)}`;const dd=new Date(cy,cm,d);const has=devFor(k)||legacy[k];cal+=`<button class="dc${k===tk?' t':''}${dd>t?' f':''}${has?' r':''}" data-act="day" data-d="${k}" aria-label="${dd.toDateString()}${has?', read':''}"><span class="dn">${d}</span><i class="dot"></i></button>`}
 return `<div class="scard"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><b style="margin:0">${first.toLocaleString('en-US',{month:'long',year:'numeric'})}</b><span style="display:flex"><button class="ib" data-act="cal" data-d="-1" aria-label="Previous month">${ic('chevL',15)}</button><button class="ib" data-act="cal" data-d="1" aria-label="Next month">${ic('chevR',15)}</button></span></div>${cal}</div></div>`;
}

/* ---------- right panel: Study notes · Guide ---------- */
function rpanelHtml(){
 const st=cur();if(!st||ui.view!=='study')return '';
 const tabs=`<div class="stabs"><button class="${ui.rpTab==='notes'?'on':''}" data-act="rptab" data-t="notes">Study notes</button><button class="${ui.rpTab==='guide'?'on':''}" data-act="rptab" data-t="guide">Guide</button>${WIDE.matches&&!ui.rpOver?'':`<button class="caret" data-act="rpclose" aria-label="Close">${ic('x',16)}</button>`}</div>`;
 let body;
 if(ui.rpTab==='notes')body=`<div class="outline rpo">${st.outline&&st.outline.trim()?md(st.outline):'<p class="muted">No Study notes yet.</p>'}</div>`;
 else{
  const tr=studyTr(st),anns=(st.annotations||[]).filter(a=>(a.spans||[]).some(s=>s.tr===tr));
  const tags={};(st.annotations||[]).forEach(a=>(a.tags||[]).forEach(t=>tags[t]=(tags[t]||0)+1));
  const notes=anns.filter(a=>a.note).sort((a,b)=>{const x=a.spans[0],y=b.spans[0];return (x.c-y.c)||(x.v-y.v)||(x.s-y.s)});
  body=`${st.summary?`<div class="gcard"><div class="gl">Summary</div><div>${md(st.summary)}</div></div>`:''}${Object.keys(tags).length?`<div class="gcard"><div class="gl">Tags</div><div class="xchips">${Object.entries(tags).map(([t,n])=>`<button data-act="gtag" data-t="${esc(t)}">#${esc(t)} <small>${n}</small></button>`).join('')}</div></div>`:''}<div class="gcard"><div class="gl">Notes in this study</div>${notes.length?notes.map(a=>{const sp=a.spans.find(s=>s.tr===tr)||a.spans[0];const p=(st.passages||[]).find(p=>p.ref&&p.ref.b===sp.b)||{};return `<button class="gnote" data-act="goto" data-s="${esc(st.id)}" data-p="${esc(p.id||'')}" data-c="${sp.c}" data-v="${sp.v}" data-m="${esc(a.id)}"><small>${esc(bname(sp.b,true))} ${sp.c}:${sp.v}</small><span class="gq">${esc(sp.text||'')}</span><span class="gn">${esc(plainMd(a.note).slice(0,140))}</span></button>`}).join(''):'<p class="muted" style="margin:4px 0 0">No notes yet.</p>'}</div>`;
 }
 return `${tabs}<div class="rbody">${body}</div>`;
}

/* ---------- the study page ---------- */
function headerRow(st,tr){
 const t=tset(),fold=SET.fold!==false,fon=filterOn();
 const filt=FS.just?`<button class="hq on fchip" data-act="fjust">${ic('eyeoff',14)}Just the text<span class="fx2">${ic('x',12)}</span></button>`:fon?`<span class="fchip2"><button class="hq on" data-act="menu" data-m="filter">${ic('solid/filter',14)}${esc(filterLabel())} · ${filterCount(st)}</button><button class="hq on fx3" data-act="fclear" aria-label="Clear the filter">${ic('x',12)}</button></span>`:`<button class="hq" data-act="menu" data-m="filter">Filter</button>`;
 return `<div class="hrow"><div class="hl"><button class="hm strong" data-act="menu" data-m="layout">${curLayout()==='para'?'Paragraphs':'Verses'} ▾</button><button class="hm" data-act="menu" data-m="tr">${esc(trName(tr))} ▾</button></div><div class="hr"><button class="hm midonly" data-act="menu" data-m="nlay">${SET.nlay==='under'?'Under':'Margin'} ▾</button><span class="sp"></span>${filt}<button class="hq" data-act="fold">${fold?'Expand':'Collapse'}</button></div></div>`;
}
function vStudy(){
 const st=cur();if(!st){ui.view='studies';return vStudies()}
 const tr=studyTr(st);ui.tab='passage';
 let body=`${banners()}<div class="studywrap"><div class="shd"><div class="ser">${esc(st.series||'')}</div><div class="ttl">${esc(st.title||'Untitled')}</div><div class="ref">${esc((st.passages||[]).map(p=>refStr(p.ref)).join(', '))}</div>${st.summary?`<button class="qsum${ui.sumOpen?' open':''}" data-act="sum">${esc(plainMd(st.summary))}</button>`:''}</div>${headerRow(st,tr)}`;
 (st.passages||[]).forEach(p=>{if((st.passages||[]).length>1)body+=`<div class="pref">${esc(refStr(p.ref))}</div>`;body+=passageRows(st,p,tr)});
 body+='<div style="height:140px"></div></div>';
 return {bar:topbar(WIDE.matches?'':esc(st.title||'Untitled'),{focus:1,rp:1}),body};
}
function pillHtml(){
 const st=cur();if(!st)return '';
 return `<button data-act="focus" aria-label="Leave Focus" title="Leave Focus">${ic('unfocus',17)}</button><span class="psep"></span><button data-act="menu" data-m="tr">${esc(trName(studyTr(st)))} ▾</button><button data-act="rpopen" data-t="notes">${ic('notesI',16)}Notes</button><button data-act="menu" data-m="filter" aria-label="Filter" class="${filterOn()||FS.just?'on':''}">${ic('filter',16)}</button><button class="aa" data-act="txt" aria-label="Text settings">Aa</button><button data-act="menu" data-m="fmore" aria-label="More">${ic('more',17)}</button>`;
}

/* ---------- Marginalia's own word selection (no browser menu) ---------- */
const WORDCH=/[\p{L}\p{N}’'\-]/u;
function caretIn(vtx,x,y){
 let node,off;
 if(document.caretRangeFromPoint){const r=document.caretRangeFromPoint(x,y);if(!r)return null;node=r.startContainer;off=r.startOffset}
 else if(document.caretPositionFromPoint){const p=document.caretPositionFromPoint(x,y);if(!p)return null;node=p.offsetNode;off=p.offset}
 else return null;
 if(!vtx.contains(node))return null;
 return offIn(vtx,node,off);
}
function wordBounds(t,o){o=Math.max(0,Math.min(t.length,o));let s=o,e=o;if(!WORDCH.test(t[o]||'')&&o>0&&WORDCH.test(t[o-1]))s=e=o-1;while(s>0&&WORDCH.test(t[s-1]))s--;while(e<t.length&&WORDCH.test(t[e]))e++;if(s===e){e=Math.min(t.length,s+1)}return [s,e]}
function rangeOf(vtx,s,e){
 const r=document.createRange(),w=document.createTreeWalker(vtx,NodeFilter.SHOW_TEXT);let n,pos=0,set=false;
 while((n=w.nextNode())){const L=n.data.length;if(!set&&s<=pos+L){r.setStart(n,s-pos);set=true}if(set&&e<=pos+L){r.setEnd(n,e-pos);return r}pos+=L}
 if(set){r.setEndAfter(vtx.lastChild||vtx)}return r;
}
function drawSel(){
 const d=ui.selDrag;if(!d)return;
 const r=rangeOf(d.vtx,d.s,d.e);
 if(window.CSS&&CSS.highlights&&window.Highlight){CSS.highlights.set('mgsel',new Highlight(r))}
 const rects=r.getClientRects?[...r.getClientRects()]:[];const k=$('#selk');if(!rects.length||!k)return;
 const a=rects[0],b=rects[rects.length-1];
 k.innerHTML=`<i class="k1" style="left:${a.left-6}px;top:${a.top-8}px;height:${a.height+8}px"></i><i class="k2" style="left:${b.right-6}px;top:${b.top}px;height:${b.height+8}px"></i>`;k.classList.add('show');
}
function clearOwnSel(){ui.selDrag=null;if(window.CSS&&CSS.highlights)CSS.highlights.delete('mgsel');const k=$('#selk');if(k){k.classList.remove('show');k.innerHTML=''}}
function finishOwnSel(){
 const d=ui.selDrag;if(!d)return;const txt=d.vtx.textContent;let s=d.s,e=d.e;while(s<e&&/\s/.test(txt[s]))s++;while(e>s&&/\s/.test(txt[e-1]))e--;if(e<=s){clearOwnSel();return}
 ui.sel={p:d.vtx.dataset.p,c:+d.vtx.dataset.c,v:+d.vtx.dataset.v,s,e,w:txt.slice(s,e)};
 if(ui.edit)closeEd(true);
 ui.barMore=false;ui.bar={mode:'new'};const rr=rangeOf(d.vtx,s,e);showBar(rr.getBoundingClientRect?rr.getBoundingClientRect():d.vtx.getBoundingClientRect());
}
/* Used by touch, Apple Pencil and mouse; also by tests. */
function selectWords(vtx,s,e){ui.selDrag={vtx,anchor:s,s,e};drawSel();finishOwnSel()}
function extendTo(x,y){
 const d=ui.selDrag;if(!d)return;const o=caretIn(d.vtx,x,y);if(o==null)return;const t=d.vtx.textContent;const [ws,we]=wordBounds(t,o);
 if(d.handle==='start'){d.s=Math.min(ws,d.e-1)}else if(d.handle==='end'){d.e=Math.max(we,d.s+1)}
 else if(o<d.anchor){d.s=ws;d.e=d.anchorEnd}else{d.s=d.anchor;d.e=we}
 drawSel();
}
let lp=null,suppressClick=false;
function startAt(x,y,target){
 const vtx=target.closest&&target.closest('.vtx');if(!vtx)return false;
 const o=caretIn(vtx,x,y);if(o==null)return false;const [s,e]=wordBounds(vtx.textContent,o);
 hideBar();ui.selDrag={vtx,anchor:s,anchorEnd:e,s,e};drawSel();return true;
}
const selView=()=>ui.view==='study'||ui.view==='devmode';
document.addEventListener('touchstart',e=>{
 if(!selView()||e.touches.length!==1)return;const t=e.touches[0],el=e.target;
 const knob=el.closest&&el.closest('#selk i');
 if(knob&&ui.selDrag){ui.selDrag.handle=knob.classList.contains('k1')?'start':'end';lp={active:true,handle:true};hideBar();return}
 if(!(el.closest&&(el.closest('.vtx')||el.closest('.vn'))))return;
 const stylus=t.touchType==='stylus';
 lp={x:t.clientX,y:t.clientY,el,active:false,stylus};
 if(stylus){lp.active=startAt(t.clientX,t.clientY,el);return}
 lp.timer=setTimeout(()=>{if(!lp)return;
  const vn=lp.el.closest&&lp.el.closest('.vn');
  if(vn&&ui.view==='study'){suppressClick=true;lp=null;verseMenu(vn);return}
  lp.active=startAt(lp.x,lp.y,lp.el);if(lp.active){suppressClick=true;if(navigator.vibrate)try{navigator.vibrate(8)}catch(x){}}
 },380);
},{passive:true});
document.addEventListener('touchmove',e=>{
 if(!lp)return;const t=e.touches[0];
 if(!lp.active){if(Math.hypot(t.clientX-lp.x,t.clientY-lp.y)>10){clearTimeout(lp.timer);lp=null}return}
 e.preventDefault();extendTo(t.clientX,t.clientY);
},{passive:false});
document.addEventListener('touchend',()=>{if(!lp)return;clearTimeout(lp.timer);const was=lp.active;lp=null;if(was){if(ui.selDrag)ui.selDrag.handle=null;finishOwnSel()}},{passive:true});
document.addEventListener('touchcancel',()=>{if(lp){clearTimeout(lp.timer);lp=null}},{passive:true});
/* Mouse or trackpad: press and drag over words. */
let mdown=null;
document.addEventListener('mousedown',e=>{if(!selView()||e.button!==0||e.sourceCapabilities&&e.sourceCapabilities.firesTouchEvents)return;if(!(e.target.closest&&e.target.closest('.vtx')))return;mdown={x:e.clientX,y:e.clientY,el:e.target,active:false}});
document.addEventListener('mousemove',e=>{if(!mdown)return;if(!mdown.active){if(Math.hypot(e.clientX-mdown.x,e.clientY-mdown.y)<4)return;mdown.active=startAt(mdown.x,mdown.y,mdown.el);if(!mdown.active){mdown=null;return}}extendTo(e.clientX,e.clientY)});
document.addEventListener('mouseup',()=>{if(!mdown)return;const was=mdown.active;mdown=null;if(was){suppressClick=true;finishOwnSel()}});
document.addEventListener('contextmenu',e=>{const vn=e.target.closest&&e.target.closest('.vn');if(vn&&ui.view==='study'){e.preventDefault();verseMenu(vn)}});
document.addEventListener('click',e=>{if(suppressClick){suppressClick=false;e.stopImmediatePropagation();e.preventDefault()}},true);

/* ---------- the verse menu (long-press a verse number) ---------- */
function verseMenu(vn){
 const row=vn.nextElementSibling&&vn.nextElementSibling.classList.contains('vtx')?vn.nextElementSibling:vn.parentElement.querySelector('.vtx');if(!row)return;
 const st=cur();if(!st)return;const p=(st.passages||[]).find(x=>x.id===row.dataset.p)||st.passages[0];const c=+row.dataset.c,v=+row.dataset.v;
 const m=$('#menu');m.dataset.k='verse';
 m.innerHTML=`<div class="mhead"><b>${esc(bname(p.ref.b,true))} ${c}:${v}</b><button class="mqi" data-act="vcopy" data-p="${esc(p.id)}" data-c="${c}" data-v="${v}" aria-label="Copy verse" title="Copy verse">${ic('copyI',15)}</button></div><button class="mi" data-act="vnote" data-p="${esc(p.id)}" data-c="${c}" data-v="${v}"><span class="ck">${ic('note',16)}</span><span>Note on this verse</span></button><button class="mi" data-act="vcopy" data-p="${esc(p.id)}" data-c="${c}" data-v="${v}"><span class="ck"></span><span>Copy verse</span></button><button class="mi" data-act="vcopy" data-ref="1" data-p="${esc(p.id)}" data-c="${c}" data-v="${v}"><span class="ck"></span><span>Copy the reference</span></button>`;
 m.classList.remove('asSheet');m.classList.add('open');const r=vn.getBoundingClientRect(),w=m.offsetWidth||220;
 m.style.top=Math.min(r.bottom+6,innerHeight-(m.offsetHeight||170)-12)+'px';m.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px';
}
ICO['copyI']='<rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" stroke="currentColor" stroke-linecap="round"/>';

/* ---------- devotional home, like the desktop's ---------- */
let VOD=null,VODBUSY=false;
function vodRef(){if(!VOD){if(!VODBUSY){VODBUSY=true;fetch('data/verse-of-day.json').then(r=>r.json()).then(a=>{VOD=a;render()}).catch(()=>{})}return null}
 const t=new Date(),leap=new Date(2024,t.getMonth(),t.getDate()),i=Math.round((leap-new Date(2024,0,1))/864e5);return parseRef(VOD[i%VOD.length])}
const BOOKKEYS=BOOKS.map(n=>n.toLowerCase().replace(/[\s.]/g,''));
const ALIAS={ps:18,psa:18,psalm:18,prov:19,pr:19,jn:42,jhn:42,mt:39,mk:40,lk:41,rom:44,song:21,sos:21,phil:49,php:49,phlm:56,jas:58,jud:64,rev:65,gen:0,ex:1,lev:2,num:3,deut:4,dt:4,josh:5,judg:6,eccl:20,isa:22,jer:23,lam:24,ezek:25,dan:26};
function parseRef(q){
 const m=String(q||'').trim().match(/^((?:[123]\s*)?[A-Za-z][A-Za-z .]*?)\s*(\d+)(?::(\d+))?(?:\s*[-–—]\s*(?:(\d+):)?(\d+))?\s*$/);if(!m)return null;
 const key=m[1].toLowerCase().replace(/[\s.]/g,'');let b=ALIAS[key];if(b==null)b=BOOKKEYS.findIndex(k=>k.startsWith(key));if(b<0||key.length<2)return null;
 const c1=+m[2];if(c1<1||c1>CHAPS[b])return null;
 if(!m[3])return {b,c1,v1:1,c2:c1,v2:999,whole:true};
 const v1=+m[3];let c2=c1,v2=v1;if(m[5]){if(m[4])c2=+m[4];v2=+m[5]}
 return {b,c1,v1,c2,v2};
}
async function settleRef(r){await webBook(r.b);if(r.v2===999)r.v2=chLen(r.b,r.c2)||r.v1;delete r.whole;return r}
async function openOneOff(ref){
 ref=await settleRef(ref);const tk=dkey(new Date()),d=devFor(tk);
 if(d&&!devTouched(d)){const p=d.passages[0];commit({op:'set',sid:d.id,patch:{passages:[{...p,ref}],title:devTitle(ref)}});devOpen(d.id);return}
 if(!d){const n=newDev(tk,ref);devOpen(n.id);return}
 const n=newDev(tk,ref,true);devOpen(n.id);
}
async function poolPick(pool){const books=DEV_POOLS[pool]||DEV_POOLS.Psalms;const seed=seedOf(pool+Date.now());const b=books[seed%books.length];const ps=await portionsFor(b);const p=ps[(seed>>>5)%ps.length];return {b,c1:p[0],v1:p[1],c2:p[2],v2:p[3]}}
const TPLCOL={inductive:'#5b8afe',soap:'#5bba88',lectio:'#a78bfa',hhh:'#f59e5b',pray:'#e96f73',free:'#9aa3b2'};
function skyOf(){const dark=document.documentElement.dataset.theme==='dark'||(document.documentElement.dataset.theme!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);const h=new Date().getHours();if(dark)return 'night';return h>=18||h<5?'eve':h>=12?'aft':'morn'}
const greeting=()=>{const h=new Date().getHours();return h<5?'Good evening':h<12?'Good morning':h<18?'Good afternoon':'Good evening'};
const partOfDay=d=>{const h=d.getHours();return h<12?'this morning':h<18?'this afternoon':'this evening'};
const SPRIG=`<div class="sprig" aria-hidden="true"><svg width="54" height="16" viewBox="0 0 54 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M2 8h19M33 8h19"/><path d="M27 13V4"/><path d="M27 9c-3-.5-5-2.5-5-5 3 .3 5 2.2 5 5zM27 9c3-.5 5-2.5 5-5-3 .3-5 2.2-5 5z" fill="currentColor" fill-opacity=".25"/></svg></div>`;
function verseText(r){if(!r)return null;const ch=chapter(devoTr(),r.b,r.c1);return ch?(ch.v[r.v1-1]||''):null}
function excerpt(r){const ch=chapter(devoTr(),r.b,r.c1);if(!ch)return '';let h='',n=0;for(let v=r.v1;v<=Math.min(r.v2,ch.v.length)&&n<180;v++){const t=ch.v[v-1]||'';h+=`<span class="vn">${v}</span>${esc(t)} `;n+=t.length}return h.length?h.replace(/\s+$/,'')+(n>=180?'…':''):''}
function lastWrote(d){const lines=String(d.outline||'').split('\n').filter(l=>l.trim()&&!/^#{1,6}\s/.test(l));const fromNotes=(d.annotations||[]).filter(a=>a.note).map(a=>plainMd(a.note));const x=lines.length?plainMd(lines[lines.length-1]):fromNotes[fromNotes.length-1];return x?x.slice(0,120):''}
function vDevo(){
 const t=new Date(),tk=dkey(t),today=devFor(tk),sky=skyOf();
 const vr=vodRef(),vt=verseText(vr);
 let hero;
 if(today){const r=devRef(today),touched=devTouched(today),done=today.dev.done;
  if(done){const notes=(today.annotations||[]).filter(a=>a.kind==='note').length+(devBody(today.outline)?1:0),hl=(today.annotations||[]).filter(a=>a.kind==='highlight').length;
   hero=`<div class="hero"><div class="rib dn"></div><div class="hl2">Today’s reading · done</div><div class="href">${esc(today.title)}</div><div class="hline"><span>${r?(r.v2-r.v1+1)+' verses · ':''}you wrote ${notes} note${notes===1?'':'s'} and ${hl} highlight${hl===1?'':'s'}</span></div><div class="hbtns"><button class="beg" data-act="devopen" data-s="${esc(today.id)}" data-notes="1">See my notes</button><button class="ql" data-act="devopen" data-s="${esc(today.id)}">Read again</button></div></div>`}
  else if(touched){const lw=lastWrote(today),cr=new Date(today.createdAt||Date.now());
   hero=`<div class="hero"><div class="rib"></div><div class="hl2">Continue</div><div class="href">${esc(today.title)}</div><div class="hline"><span>Started ${partOfDay(cr)} · ${cr.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}</span><button class="tp" data-act="menu" data-m="dtplh">${esc((DTPL[today.dev.tmpl]||DTPL.inductive).n)} ▾</button></div>${lw?`<div class="lwl">You last wrote</div><div class="lastw">“${esc(lw)}”</div>`:''}<div class="hbtns"><button class="beg" data-act="devopen" data-s="${esc(today.id)}">Continue</button><button class="ql" data-act="dstartover">${ui.overArm?'Tap again to start over':'Start over'}</button></div><div class="micro">Pick up where you left off.</div></div>`}
  else{hero=heroNew(today.title,r,today.id)}
 }else{const r=devProposal(tk);hero=heroNew(r?devTitle(r):'…',r,null)}
 const past=pastReading(today);
 const rec=devList().filter(d=>d!==today).sort((a,b)=>a.dev.date<b.dev.date?1:-1).slice(0,3);
 const body=`<div class="dh ${sky}">${sky==='night'?'<div class="stars"></div>':''}<div class="dhcol">
 <div class="greet">${greeting()}</div><div class="dhdate">${t.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</div>
 ${vr?`<div class="vod">${vt?`“${esc(vt)}”`:'…'}</div><div class="vodref"><span>${esc(bname(vr.b,true))} ${vr.c1}:${vr.v1} · ${esc(trName(devoTr()))}</span><button class="ql" data-act="vodctx">Read in context</button></div>`:''}
 ${SPRIG}${hero}
 <div class="sec"><div class="lbl2">Choose your own passage</div><div class="go"><input id="gopass" class="in" placeholder="Go to a passage, e.g. Romans 8 or John 3:1–21" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go"><button class="ob" data-act="goopen">Open</button></div><div class="chs">${[['Psalms','A Psalm'],['Proverbs','A Proverb'],['Gospels','A Gospel passage'],['Epistles','A letter']].map(([p,l])=>`<button data-act="gopool" data-p="${p}">${l}</button>`).join('')}</div></div>
 ${past?`<div class="sec"><div class="lbl2">From your past readings</div><button class="past" data-act="devopen" data-s="${esc(past.d.id)}"><small>${esc(past.label)}</small><b>${esc(past.d.title)}</b>${lastWrote(past.d)?`<i>“${esc(lastWrote(past.d))}”</i>`:''}</button></div>`:''}
 ${rec.length?`<div class="sec"><div class="lbl2">Recent</div>${rec.map(d=>`<button class="rrow" data-act="devopen" data-s="${esc(d.id)}"><span class="rdot" style="background:${TPLCOL[d.dev.tmpl]||TPLCOL.free}"></span><b>${esc(d.title)}</b><i>${esc(lastWrote(d))}</i><small>${kdate(d.dev.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</small></button>`).join('')}</div>`:''}
 ${SPRIG}</div></div>`;
 const calBtn=WIDE.matches&&sideDocked()?'':`<button class="ib" data-act="devcal" aria-label="Calendar" title="Calendar">${ic('calendar',18)}</button>`;
 return {bar:topbar(WIDE.matches?'':'Devotional',{extra:calBtn}),body};
}
function heroNew(title,r,id){
 const tm=LS.get('devTpl','inductive');
 return `<div class="hero"><div class="rib"></div><div class="hl2">Today’s reading</div><div class="href">${esc(title)}</div><div class="hline"><span>${r?(r.v2-r.v1+1)+' verses · about '+Math.max(1,Math.round((r.v2-r.v1+1)*25/200))+' minute'+(Math.round((r.v2-r.v1+1)*25/200)>1?'s':''):''}</span><button class="tp" data-act="menu" data-m="dtplh">${esc((DTPL[tm]||DTPL.inductive).n)} ▾</button></div>${r?`<div class="exc">${excerpt(r)||'…'}</div>`:''}<div class="hbtns"><button class="beg" ${id?`data-act="devopen" data-s="${esc(id)}"`:'data-act="start"'}${r?'':' disabled'}>Begin</button><button class="ql" data-act="another">Another</button></div><div class="micro">Take your time.</div></div>`;
}
function pastReading(today){
 const t=new Date(),md=dkey(t).slice(5),tk=dkey(t);
 const same=devList().filter(d=>d.dev.date.slice(5)===md&&d.dev.date<tk).sort((a,b)=>a.dev.date<b.dev.date?1:-1)[0];
 if(same)return {d:same,label:`${kdate(same.dev.date).getFullYear()} · this day`};
 const r=today?devRef(today):devProposal(tk);if(!r)return null;
 const prev=devList().filter(d=>d!==today&&d.dev.date<tk&&devRef(d)&&devRef(d).b===r.b).sort((a,b)=>a.dev.date<b.dev.date?1:-1)[0];
 return prev?{d:prev,label:`Last time in ${bname(r.b)} · ${kdate(prev.dev.date).toLocaleDateString('en-US',{month:'long',day:'numeric'})}`}:null;
}
function showSheetHtml(html){const s=$('#sheet');s.innerHTML=`<div class="grab"></div>${html}`;s.classList.add('open');$('#scrim').classList.add('show');$('#scrim').dataset.for='sheet'}
function closeSheet(){const s=$('#sheet');if(s){s.classList.remove('open');s.innerHTML=''}const sc=$('#scrim');if(sc&&sc.dataset.for==='sheet'){sc.classList.remove('show');sc.dataset.for=''}}
function vodContext(){
 const r=vodRef();if(!r)return;const ch=chapter(devoTr(),r.b,r.c1);
 if(!ch){showSheetHtml('<p class="muted">Loading…</p>');setTimeout(vodContext,500);return}
 const a=Math.max(1,r.v1-4),z=Math.min(ch.v.length,r.v1+4);
 showSheetHtml(`<div class="gl" style="margin-bottom:6px">${esc(bname(r.b,true))} ${r.c1}:${a}–${z} · ${esc(trName(devoTr()))}</div><p class="vt ctx">${Array.from({length:z-a+1},(_,i)=>a+i).map(v=>`<span class="${v===r.v1?'vod-on':''}"><span class="vn">${v}</span>${esc(ch.v[v-1]||'')} </span>`).join('')}</p><div style="display:flex;gap:12px;margin-top:12px"><button class="btn" data-act="vodread">Read this chapter</button><button class="quiet" data-act="sheetx">Close</button></div>`);
}

window.MarginaliaState=S;window.MarginaliaTest={selectWords,parseRef,verseMenu};
/* ---------- start ---------- */
(async function start(){
 applyTheme();applyText();
 try{S.studies=(await DB.get('studies'))||{};S.pending=(await DB.get('pending'))||[];S.devo=(await DB.get('devo'))||{log:{}}}catch(e){}
 const first=studyList()[0];if(first)ui.sid=first.id;
 ui.view=WIDE.matches&&first?'study':'studies';
 render();
 if(getComputedStyle(document.documentElement).getPropertyValue('--mg-css').trim()!==CSS_VER)setTimeout(()=>toast('Some app files on the site are from an older version. Upload app.css and index.html again.'),800);
 {const seen=LS.get('seenVer',null);if(seen&&seen!==VERSION)showWhatsNew(seen);else if(!seen&&Object.keys(S.studies).length)showWhatsNew('1.2.0');LS.set('seenVer',VERSION)}
 await initAuth();
 render();
 if(account)sync();
 if('serviceWorker' in navigator&&location.protocol==='https:'){
  navigator.serviceWorker.register('sw.js').then(r=>{r.addEventListener('updatefound',()=>{const n=r.installing;if(n)n.addEventListener('statechange',()=>{if(n.state==='activated'&&navigator.serviceWorker.controller)toast('A new version is ready',()=>location.reload(),'Reload')})})}).catch(()=>{});
 }
})();
