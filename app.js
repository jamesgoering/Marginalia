'use strict';
/* Marginalia for iPad and phone. Reads and writes the desktop app's study files in OneDrive. */
const VERSION='1.7.0';
const CSS_VER='170';
const $=s=>document.querySelector(s);
/* Older index.html files lack some parts; add any that are missing so a partial upload can't break menus. */
[['mbar','toolbar'],['scrim',''],['menu','menu'],['ed','dialog'],['tx','dialog'],['toast','status'],['wn','dialog'],['pill','toolbar'],['sheet','dialog'],['selk',''],['tsug','listbox'],['biu','toolbar'],['fx',''],['share','dialog'],['cmd','']].forEach(([id,role])=>{if(!document.getElementById(id)){const d=document.createElement('div');d.id=id;if(role)d.setAttribute('role',role);if(id==='scrim')d.dataset.act='scrim';document.body.appendChild(d)}});
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
 if(!LOADING[k]&&!CHERR[k]){LOADING[k]=fetchChapter(tr,b,c).then(d=>withParagraphs(tr,b,c,d)).then(d=>{CH[k]=d;delete LOADING[k];if(typeof bibFill==='function'&&bibFill(tr,b,c))return;render()}).catch(e=>{CHERR[k]=e.message||String(e);delete LOADING[k];render()})}
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
function inl(s){s=esc(s);return s.replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g,'<u>$1</u>').replace(/==\{(#[0-9a-fA-F]{6})\}(.+?)==/g,'<mark style="background:color-mix(in srgb,$1 30%,transparent)">$2</mark>').replace(/==(.+?)==/g,'<mark>$1</mark>').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|[^*])\*([^*]+)\*/g,'$1<i>$2</i>').replace(/(^|\W)_([^_]+)_(?=\W|$)/g,'$1<i>$2</i>')}
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
const FONTS=[['source','Source Serif','"Source Serif 4",Georgia,serif'],['literata','Literata','Literata,Georgia,serif'],['georgia','Georgia','"MG Georgia",Georgia,"Times New Roman",serif'],['charter','Charter','"MG Charter",Charter,"Bitstream Charter",Georgia,serif'],['palatino','Palatino','"MG Palatino",Palatino,"Palatino Linotype","Book Antiqua",Georgia,serif'],['sans','Sans serif','Figtree,Inter,system-ui,-apple-system,sans-serif']];
const LH=[['1.5','Tight'],['1.75','Normal'],['2','Relaxed'],['2.3','Airy']];
const TDEF={font:'source',size:1,lh:'1.75',vn:true,layout:'verse'};
const tset=()=>Object.assign({},TDEF,LS.get('text',{}));
const curLayout=()=>ui.view==='devmode'?LS.get('devLayout',tset().layout):ui.view==='bible'?LS.get('bibLayout',tset().layout):tset().layout;
function applyText(){const t=tset(),r=document.documentElement.style,f=FONTS.find(x=>x[0]===t.font)||FONTS[0];r.setProperty('--sfont',f[2]);r.setProperty('--tsz',t.size);r.setProperty('--tlh',t.lh);$('#app').classList.toggle('novn',!t.vn);$('#tx').classList.toggle('novn',!t.vn)}
function refreshTx(x){if(!x)return;const t=x.scrollTop;x.innerHTML=txtHtml();x.scrollTop=t}
function setText(p){if('layout' in p&&(ui.view==='devmode'||ui.view==='bible')){LS.set(ui.view==='bible'?'bibLayout':'devLayout',p.layout);render();const x=$('#tx');if(x.classList.contains('open'))refreshTx(x);return}LS.set('text',Object.assign(tset(),p));applyText();if('layout' in p)render();const x=$('#tx');if(x.classList.contains('open'))refreshTx(x)}

/* ---------- UI state ---------- */
const WIDE=matchMedia('(min-width:980px)');
const MID=matchMedia('(min-width:680px)');
const ui={selCard:null,view:'home',back:'studies',sid:null,tab:'passage',sel:null,bar:null,barMore:false,edit:null,color:3,flash:null,flashV:null,sumOpen:false,q:'',cal:null,dr:null,another:0,unfold:new Set()};
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
 ${tags.length?`<div class="msec">Tags <button class="mlink" data-act="managetags">Manage tags…</button></div><div class="fchips">${tags.map(t=>`<button class="fc${FS.tags.has(t)?' on':''}" data-act="ftog" data-g="tags" data-v="${esc(t)}"${FS.just?' disabled':''}>#${esc(t)}<small>${cnt(a=>(a.tags||[]).includes(t))}</small></button>`).join('')}</div>`:''}
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
   (st.annotations||[]).forEach(a=>{if(!annVisible(a))return;const sp=(a.spans||[]).find(s=>s.tr===tr&&s.b===r.b&&s.c===x.c&&s.v===x.v);if(!sp)return;if((a.spans||[]).find(s=>s.tr===tr)!==sp)return;if(a.note||(a.tags&&a.tags.length)||a.kind==='connect'||a.kind==='above'||ui.edit===a.id||ui.edit===a.id)cards.push({a,anch:!!anchor(sp,x.t)})});
   return (i?`<span class="va" id="v-${ids[i]}"></span>`:'')+vlabel(x.c,x.v,gi===0&&i===0)+`<span class="vtx" data-p="${esc(p.id)}" data-c="${x.c}" data-v="${x.v}">${markup(x.t,ms,para&&x.ch.q?x.ch.q[x.v]:null)}</span>`;
  }).join(' ');
  const dots=SET.nlay==='dots'&&ui.view==='study';const shown=dots?cards.filter(c=>ui.dotOpen.has(c.a.id)||ui.edit===c.a.id):cards;
  const dotHtml=dots?cards.map(c=>`<button class="ndot${ui.dotOpen.has(c.a.id)?' open':''}" data-act="ndot" data-m="${esc(c.a.id)}" style="--mc:${okHex((c.a.titleTag&&tagCol(c.a.titleTag))||c.a.color)}" aria-label="Note: ${esc((c.a.spans||[{}])[0].text||'')}"></button>`).join(''):'';
  return `<div class="vrow${ids.includes(ui.flashV)?' flash':''}${g.stz?' stz':''}" id="v-${ids[0]}"><p class="vt${g.poem?' poem':''}">${parts}${dotHtml}</p><div class="cards">${shown.map(cardHtml).join('')}</div></div>`;
 }).join('');
 const cp=copy||(TRS[tr]&&TRS[tr].copy)||'';
 return html+(cp?`<p class="copy">${esc(cp)}</p>`:'');
}
function cardHtml({a,anch}){
 if(ui.edit===a.id&&ui.view==='study')return editCardHtml(a);
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
function devOpen(id,toNotes){ui.devSid=id;ui.view='devmode';closeEd(true);hideBar();closeMenu();lastKey='';ui.devCtl=false;ui.otOpen=!!toNotes;render();const b=$('#body');b.scrollTop=0}
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
   const mwHtml=list=>list.sort((x,y)=>{const a=(x.a.spans||[])[0]||{},b=(y.a.spans||[])[0]||{};return ((a.c||0)-(b.c||0))||((a.v||0)-(b.v||0))||((x.whole?-1:x.s)-(y.whole?-1:y.s))}).map(({a,whole})=>{const sp=(a.spans||[])[0]||{},ed=ui.edit===a.id;const head=whole?'':`<em class="q">${esc(sp.text||'')}</em>`;
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
 const body=`<div class="dvt ${light}${ui.otOpen?' otopen':''}" id="dvt"><div class="dvcol">
  <div class="dslim" hidden><button data-act="dexit">${ic('chevL',16)}Today</button><span class="dslt">${esc(st.title||'')}</span><span class="dsld">${esc(dl)}</span><span class="sp"></span><button data-act="share" aria-label="Share this reading">${ic('shareI',17)}</button><button data-act="menu" data-m="dmore" aria-label="More">${ic('more',17)}</button></div><div class="dfsticky">${devNavHtml(st)}<b>${esc(st.title||'')}</b></div><div class="dlab">${esc(dl)}</div><div class="dref">${esc(st.title||'')}</div><div class="dmeta">${vcount} verses · about ${Math.max(1,Math.round(words/200))} minute${Math.round(words/200)>1?'s':''}${st.dev.done?' · done':''}</div>
  ${err?`<p class="ph">${esc(err)}</p>`:loading?'<p class="ph">Loading the reading…</p>':rows}
  ${cp?`<p class="copy" style="padding:10px 0 0">${esc(cp)}</p>`:''}
  <div class="orn">· ❦ ·</div>
  <div class="wr wr2" id="devwr"><div class="done"><span class="hint2">Select words to highlight, underline or comment; comments appear beside the verse</span><button class="dbtn" data-act="ddone">${st.dev.done?'Close':'Done'}</button></div></div>
 </div>
 ${ui.otOpen?otHtml(st,tmpl):''}
 <div class="dset${ui.dsetOpen?' open':''}" id="dset">${ui.dsetOpen?`<button data-act="dexit">${ic('chevL',16)}Today</button><button class="aa" data-act="txt" aria-label="Reading settings">Aa</button><button data-act="share" aria-label="Share this reading">${ic('shareI',16)}</button><button data-act="otopen" class="${ui.otOpen?'on':''}" aria-label="Overall thoughts" title="Overall thoughts">${ic('pen',16)}</button><button data-act="menu" data-m="dmore" aria-label="More">${ic('more',17)}</button>`:''}<button class="dsetb${ui.dsetOpen?' on':''}" data-act="dset" aria-label="${ui.dsetOpen?'Close settings':'Settings'}">${DSETI}</button></div>
 <div class="dctl${ui.devCtl?' show':''}" id="dctl"><button class="cb" data-act="dexit">${ic('chevL',16)}Today</button><span class="sp"></span><button class="cb" data-act="share" aria-label="Share this reading">${ic('shareI',16)}</button><button class="cb aa2" data-act="txt" aria-label="Text and light">Aa</button><button class="cb" data-act="menu" data-m="dmore" aria-label="More">${ic('more',16)}</button></div>
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
 <div class="lbl">About this screen</div><div style="margin-bottom:16px">${ui.scrInfo?`<div class="scrinfo">${Object.entries(screenInfo()).map(([k,v])=>`<span>${k}</span><b>${esc(String(v))}</b>`).join('')}</div><p class="muted" style="font-size:12.5px">If there’s a band at the bottom of the window, a screenshot of this helps track it down.</p>`:`<button class="quiet" data-act="scrinfo">Show what this iPad tells the app about the window</button>`}</div>
 <p class="muted" style="font-size:12.5px;margin-top:18px">Marginalia for iPad and phone, version ${VERSION}. Changes you make here are saved into the same study files the desktop app uses. Close a study on the computer before marking it here, or the computer may save over your changes.</p></div>`};
}
const acctSeg=()=>`<div class="lbl" style="margin-top:4px">Account type</div><div class="seg" id="acct" data-v="${CFG.personal?'personal':'work'}"><button class="${CFG.personal?'on':''}" data-act="acct" data-v="personal">Personal (OneDrive)</button><button class="${CFG.personal?'':'on'}" data-act="acct" data-v="work">Work or school</button></div>`;

/* ---------- shell ---------- */
function tabOf(v){return {studies:'Studies',study:'Studies',devo:'Devotional',devoRead:'Devotional'}[v]||''}
function tabsHtml(){const t=tabOf(ui.view);return [['Studies','book','studies'],['Devotional','cal','devo']].map(([l,i,v])=>`<button class="tab${t===l?' on':''}" data-act="nav" data-v="${v}">${ic(i,22)}${l}</button>`).join('')}
let lastKey='';
function render(){
 if(document.activeElement&&(['devnotes','enote','etagin','rpnotes'].includes(document.activeElement.id)&&(ui.view==='devmode'||ui.view==='study')||['bq','gopass','shtt','shnm'].includes(document.activeElement.id))){ui.pendRender=true;return}
 ui.pendRender=false;
 if(WIDE.matches&&ui.view==='studies'&&cur())ui.view='study';
 if(ui.view==='study'&&!cur())ui.view='studies';
 const fn={home:vHome,studies:vStudies,study:vStudy,search:vSearch,devo:vDevo,devmode:vDevMode,settings:vSettings,bible:vBible}[ui.view]||vHome;
 const ae=document.activeElement,keepFocus=ae&&ae.id&&(ae.tagName==='INPUT'||ae.tagName==='TEXTAREA')&&!ae.closest('#ed')?{id:ae.id,s:ae.selectionStart,e:ae.selectionEnd}:null;
 const V=fn(),body=$('#body'),key=ui.view+'|'+(ui.view==='devmode'?ui.devSid:ui.sid)+'|'+focusOn()+'|'+(ui.view==='bible'?(ui.bibList?'list':(ui.bibChs&&ui.bibChs[0]?ui.bibChs[0].join(':'):bibleRef().b+':'+bibleRef().c)):''),top=key===lastKey?body.scrollTop:0;
 $('#bar').innerHTML=V.bar;{const sig=ui.view==='bible'&&!ui.bibList?[key,(ui.bibChs||[]).join('|'),bibPageGet(),curLayout(),JSON.stringify(tset()),studyList().reduce((n,x)=>n+(x.annotations||[]).length,0),JSON.stringify(ui.bibToday||0),!!banners()].join('#'):null;if(!(sig&&sig===ui._bibSig&&key===lastKey&&body.querySelector('.studywrap.bible')))body.innerHTML=V.body;ui._bibSig=sig}
 const app=$('#app');app.classList.remove('noside');app.classList.toggle('under',SET.nlay==='under'||SET.nlay==='dots');app.classList.toggle('dots',SET.nlay==='dots');app.classList.toggle('notabs',!!['search','settings'].includes(ui.view)&&!WIDE.matches);app.classList.toggle('devfull',ui.view==='devmode');setThemeColor(ui.view==='devmode'?DEV_BG[devLight()]:null);document.documentElement.classList.toggle('edge',ui.view==='devmode'||focusOn());$('#body').style.background=ui.view==='devmode'?DEV_BG[devLight()]:(ui.view==='bible'&&!ui.bibList&&bibPageGet()&&BPAGES[bibPageGet()])?BPAGES[bibPageGet()][1]:'';document.documentElement.style.background=ui.view==='devmode'?DEV_BG[devLight()]:ui.view==='devo'?({morn:'#fbf8f2',aft:'#fbf8f2',eve:'#fbdcc2',night:'#3d2430'})[skyOf()]:'';
 if(ui.view!=='study')ui.rpOver=false;
 if(WIDE.matches&&!focusOn())ui.sideOver=false;
 app.classList.toggle('focus',focusOn());['v-study','v-bible'].forEach(k=>app.classList.toggle(k,'v-'+ui.view===k));app.classList.toggle('nobar',['study','home'].includes(ui.view)||(ui.view==='bible'&&!ui.bibList));app.classList.toggle('nl-hidden',(SET.nlay||'margin')==='hidden');{const pg=bibPageGet(),onB=ui.view==='bible'&&!ui.bibList;app.classList.toggle('bpage-eve',onB&&['dark','black'].includes(pg));app.classList.toggle('bpage-morn',onB&&pg==='sepia');const bc=onB&&pg&&BPAGES[pg]?BPAGES[pg][1]:'';$('#bar').style.background=bc?bc+'e6':'';$('#body').dataset.pg=bc;app.classList.toggle('dkd',ui.view==='devmode'&&(devLight()==='dark'||isDarkTheme()));app.classList.toggle('dv-hide',!!SET.devHide)}app.classList.toggle('sidedock',sideDocked());app.classList.toggle('sideover',!!ui.sideOver);app.classList.toggle('rpdock',rpDocked());app.classList.toggle('rpover',!!ui.rpOver&&ui.view==='study');
 $('#scrim').classList.toggle('show',!!ui.sideOver||(!!ui.rpOver&&!rpDocked()&&ui.view==='study'));
 {const sh=sideHtml();if(sh!==ui._sideHtml){const sb=$('#side .sbody'),t=sb?sb.scrollTop:0;$('#side').innerHTML=sh;ui._sideHtml=sh;const nb=$('#side .sbody');if(nb)nb.scrollTop=t}}$('#rpanel').innerHTML=rpShown()?rpanelHtml():'';applyRpSize();$('#pill').innerHTML=focusOn()?pillHtml():'';if(ui._spView!==ui.view){ui.spOpen=false;ui._spView=ui.view}$('#fx').innerHTML=fxHtml();$('#fx').classList.toggle('on',!!fxHtml());$('#pill').classList.toggle('on',focusOn());if(!focusOn())$('#pill').classList.remove('hide');
 body.scrollTop=top;lastKey=key;
 if(keepFocus){const el=document.getElementById(keepFocus.id);if(el&&el!==ae){el.focus();try{el.setSelectionRange(keepFocus.s,keepFocus.e)}catch(e){}}}
 if(!['study','devmode','bible'].includes(ui.view))$('#tx').classList.remove('open');
 if(!['study','devmode'].includes(ui.view)){hideBar();closeEd(true)}
 else if(ui.bar)placeBar();
 if(ui.view==='devmode')requestAnimationFrame(alignMargin);
 setTimeout(navTrack,0);
 if(ui.view==='study'&&cur()&&ui._lastRec!=='s'+ui.sid){ui._lastRec='s'+ui.sid;LS.set('lastStudy',ui.sid);pushRecent({k:'study',id:ui.sid,t:cur().title||'Untitled'})}
 
 if(ui.view==='devmode'){const ds=S.studies[ui.devSid]&&S.studies[ui.devSid].d;if(ds&&ui._lastRec!=='d'+ui.devSid){ui._lastRec='d'+ui.devSid;pushRecent({k:'devo',id:ui.devSid,t:ds.title||'Reading'})}}
 if(ui.view!=='devmode')ui.otOpen=false;
 if(ui.view==='study')requestAnimationFrame(posDiv);
 if(ui.flashV){const el=document.getElementById('v-'+ui.flashV);ui.flashV=null;if(el){el.scrollIntoView({block:'start'});setTimeout(()=>document.querySelectorAll('.vrow.flash').forEach(x=>x.classList.remove('flash')),1600)}}
}

/* ---------- menus ---------- */
function openMenu(btn,kind){
 const st=cur();const m=$('#menu');let items=[];
 if(kind==='tr'&&st){const tr=studyTr(st),anns=st.annotations||[];
  const list=[...new Set([...(st.translations||[]),'kjv','web','esv','net','nkjv'])].filter(t=>TRS[t]&&TRS[t].src!=='none');
  items=list.map(t=>{const n=anns.filter(a=>(a.spans||[]).some(s=>s.tr===t)).length;return {act:'settr',d:{tr:t},label:trName(t)+(n?` <small>${n} mark${n>1?'s':''}</small>`:''),on:t===tr,off:!trAvailable(t)}})}
 else if(kind==='layout')items=[['verse','Verse by verse'],['para','Paragraphs and poetry']].map(([v,l])=>({act:'tlay',d:{v},label:l,on:curLayout()===v}));
 else if(kind==='nlay')items=[['margin','Margin','Notes beside the text'],['under','Under','Notes under each verse'],['dots','Dots','A small dot for each note']].map(([v,l,h])=>({act:'nlay',d:{v},label:`${l} <small>${h}</small>`,on:(SET.nlay||'margin')===v}));
 else if(kind==='dtpl'&&st){const curT=st.dev&&DTPL[st.dev.tmpl]?st.dev.tmpl:LS.get('devTpl','inductive');items=Object.entries(DTPL).map(([k,t])=>({act:'dtplset',d:{t:k},label:t.n,on:k===curT}))}
 else if(kind==='dmore'){items=[{act:'dmargin',d:{v:SET.devMargin===false?'1':'0'},label:SET.devMargin===false?'Show comments':'Hide comments',icon:'comment'},{act:'txt',d:{},label:'Reading settings',icon:'sliders'},{act:'menu',d:{m:'dtpl'},label:'Template ›'},{act:'dwhole',d:{},label:'Read the whole chapter',icon:'bibleI'},{act:'share',d:{},label:'Share this reading…',icon:'shareI'},{hr:1},{act:'dexit',d:{},label:'Back to today',icon:'chevL'}]}
 if(kind==='card'){const a=findAnn(btn.dataset.id);if(!a)return;const lbl=(KLABEL[a.kind]||'mark').toLowerCase(),id=esc(a.id);const tags=a.tags||[];const cur=a.titleTag||tags[0];
  items=[{act:'cedit',d:{id:a.id},label:'Edit note',icon:'pencil'}];
  if(tags.length>1)tags.forEach(t=>items.push({act:'cpin',d:{id:a.id,t},label:'Pin #'+esc(t)+' as the title',icon:'pin',on:t===cur}));
  items.push({hr:1});
  if(a.kind==='note')items.push({act:'cdelmark',d:{id:a.id},label:'Delete the comment',icon:'trash',red:1});
  else{if(a.note)items.push({act:'cdelnote',d:{id:a.id},label:`Delete the note <small>keeps the ${esc(lbl)}</small>`,icon:'note'});items.push({act:'cdelmark',d:{id:a.id},label:a.note?`Delete the ${esc(lbl)} and note`:`Delete the ${esc(lbl)}`,icon:'trash',red:1})}
 }
 if(kind==='dtplh'){const tk=dkey(new Date()),d=devFor(tk),curT=d&&d.dev&&DTPL[d.dev.tmpl]?d.dev.tmpl:LS.get('devTpl','inductive');items=Object.entries(DTPL).map(([k,t])=>({act:'dtplhome',d:{t:k},label:t.n,on:k===curT}))}
 if(kind==='bmore')items=[{act:'txt',d:{},label:'Reading settings',icon:'sliders'},{act:'nav',d:{v:'search'},label:'Search the Bible',icon:'search'},{hr:1},{act:'sideopen',d:{t:'Studies'},label:'Studies',icon:'book'},{act:'nav',d:{v:'devo'},label:'Devotional',icon:'cal'}];
 if(kind==='smore')items=[{act:'focus',d:{},label:focusOn()?'Leave Focus':'Focus',icon:'focus'},{hr:1},{act:'txt',d:{},label:'Reading settings',icon:'sliders'},{act:'nav',d:{v:'search'},label:'Search',icon:'search'}];
 if(kind==='btr'){items=Object.keys(TRS).filter(trAvailable).map(k=>({act:'bsettr',d:{tr:k},label:TRS[k].n,on:bibleTr()===k}))}
 const heads={btr:'Translation',tr:'Translation',layout:'Layout',nlay:'Notes',dtpl:'Template',dtplh:'Template',dmore:'Reading'};
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
 if(ui.selDrag)return; /* Marginalia's own selection is showing; a caret in a note box doesn't cancel it */
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
 if(ui.view==='bible'&&ui.sel){const r=selRefStr(ui.sel);return `<button class="tb2 txtb nsb" data-act="bnewsel">${ic('plusI',16)}<span><b>New study</b><small>${esc(r)}</small></span></button><span class="dv"></span><button class="tb2 txtb" data-act="bcopysel">Copy</button>`}
 const a=ui.bar&&ui.bar.mode==='edit'?findAnn(ui.bar.id):null;
 const curCol=a?String(a.color).toLowerCase():null;
 const hlBtn=a&&a.kind!=='highlight'?`<button class="tb2" data-act="bkind" data-k="highlight" aria-label="Make it a highlight" title="Highlight">${ic('hlt',18)}</button>`:'';
 const kinds=[['underline','underline','Underline'],['circle','circle','Circle'],['note','note','Comment']];
 const dev=ui.view==='devmode';
 if(dev){const kinds2=[['underline','underline','Underline'],['note','note','Comment']];return `${[3,2,0,1].map(i=>{const c=PALETTE[i];return `<button class="sw${curCol===c?' on':''}" style="background:${c}" data-act="bcolor" data-c="${i}" aria-label="${a?(a.kind==='highlight'&&curCol===c?'Remove highlight':'Color'):'Highlight'}"></button>`}).join('')}<span class="dv"></span>${hlBtn}${kinds2.map(([k,i,l])=>`<button class="tb2${a&&a.kind===k?' on':''}" data-act="bkind" data-k="${k}" aria-label="${l}" title="${l}">${ic(i,18)}</button>`).join('')}${a?`<span class="dv"></span><button class="tb2" data-act="bnote" aria-label="Write a note" title="Note">${ic('pencil',17)}</button><button class="tb2" data-act="bdel" aria-label="Delete" title="Delete">${ic('trash',17)}</button>`:''}`}
 return `${PALETTE.map((c,i)=>`<button class="sw${curCol===c?' on':''}" style="background:${c}" data-act="bcolor" data-c="${i}" aria-label="${a?(a.kind==='highlight'&&curCol===c?'Remove highlight':'Color '+(i+1)):'Highlight, color '+(i+1)}"></button>`).join('')}<span class="dv"></span>${hlBtn}${ui.barMore?kinds.map(([k,i,l])=>`<button class="tb2${a&&a.kind===k?' on':''}" data-act="bkind" data-k="${k}" aria-label="${a&&a.kind===k?'Remove '+l.toLowerCase():l}" title="${l}">${ic(i,18)}</button>`).join(''):`<button class="more" data-act="bmore" aria-label="Underline, circle or comment" title="Underline, circle, comment">•••</button>`}${a?`<span class="dv"></span><button class="tb2" data-act="bnote" aria-label="Write a note" title="Note">${ic('pencil',17)}</button><button class="tb2" data-act="bdel" aria-label="Delete this mark" title="Delete">${ic('trash',17)}</button>`:''}`;
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
 const a={id:newId(),kind,color:kind==='note'?'#5b8afe':PALETTE[ui.color],spans:(sl.multi||[sl]).map(x=>({tr:studyTr(st),b:p.ref.b,c:x.c,v:x.v,s:x.s,e:x.e,text:x.text||x.w})),note:'',tags:[],created:new Date().toISOString()};
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
  if(t==='U'){let save=out;out='';n.childNodes.forEach(walk);const s2=out;out=save;out+=s2.trim()?'<u>'+s2+'</u>':s2;return}
  const w=(t==='B'||t==='STRONG')?'**':(t==='I'||t==='EM')?'*':t==='MARK'?'==':'';
  if(w){const inner=document.createElement('div');let save=out;out='';n.childNodes.forEach(walk);const s=out;out=save;const m=s.match(/^(\s*)([\s\S]*?)(\s*)$/);out+=m[2]?m[1]+w+m[2]+w+m[3]:s;return}
  n.childNodes.forEach(walk);
  if(block&&!out.endsWith('\n'))out+='\n';
 };
 root.childNodes.forEach(walk);
 return out.replace(/\n{3,}/g,'\n\n').replace(/\s+$/,'');
}
function openEd(id){hideBar();ui.edPop=false;{const ae=document.activeElement;if(ae&&/^(devnotes|rpnotes)$/.test(ae.id)){ae.blur();ui.pendRender=false}}ui.edit=id;ui.unfold.add(id);render();renderEd();const n=$('#enote');if(n){n.focus();try{const r=document.createRange();r.selectNodeContents(n);r.collapse(false);const s=getSelection();s.removeAllRanges();s.addRange(r)}catch(e){}}}
function renderEd(){
 const ed=$('#ed');const a=ui.edit&&findAnn(ui.edit);
 if(true){ed.classList.remove('open');ed.innerHTML='';return}
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
 settr:el=>{ui.txPage=null;const t=el.dataset.tr;closeMenu();if(!trAvailable(t)){toast(`Add the ${TRS[t]&&TRS[t].src==='esv'?'ESV':'API.Bible'} key in Settings to read ${trName(t)}`);return}SET.tr[cur().id]=t;saveSet();hideBar();render()},
 tlay:el=>{closeMenu();setText({layout:el.dataset.v})},
 nlay:el=>{const inTx=!!el.closest('#tx');if(!inTx)closeMenu();SET.nlay=el.dataset.v;saveSet();lastKey='';render();refreshTx($('#tx'))},
 fold:()=>{SET.fold=!(SET.fold!==false);ui.unfold.clear();saveSet();render()},
 retry:el=>{Object.keys(CHERR).forEach(k=>{if(k.startsWith(el.dataset.tr+'|'))delete CHERR[k]});render()},
 sum:()=>{ui.sumOpen=!ui.sumOpen;render()},
 card:el=>{const id=el.dataset.m;if(ui.edit===id)return;hideBar();if(ui.selCard===id){ui.selCard=null;ui.unfold.delete(id);render();return}ui.selCard=id;ui.unfold.add(id);render()},
 cedit:el=>{closeMenu();openEd(el.dataset.id)},
 cpin:el=>{closeMenu();const a=findAnn(el.dataset.id);if(!a)return;commit({op:'upd',sid:cur().id,id:a.id,patch:{titleTag:el.dataset.t}});render()},
 cdelnote:el=>{closeMenu();const a=findAnn(el.dataset.id);if(!a)return;const old={note:a.note||'',tags:[...(a.tags||[])],titleTag:a.titleTag};const sid=cur().id;commit({op:'upd',sid,id:a.id,patch:{note:''}});ui.selCard=null;render();toast('Note deleted',()=>{commit({op:'upd',sid,id:a.id,patch:{note:old.note}});render()})},
 cdelmark:el=>{closeMenu();const a=findAnn(el.dataset.id);if(!a)return;ui.selCard=null;removeAnn(a)},
 scrim:()=>{closeMenu();closeSheet();closeShare();if(ui.sideOver||ui.rpOver){ui.sideOver=false;ui.rpOver=false;render()}},
 sidebtn:()=>{if(WIDE.matches&&!focusOn()){SET.side=SET.side===false;saveSet();render();return}ui.sideOver=!ui.sideOver;ui.rpOver=false;render()},
 sideopen:el=>{closeMenu();ui.sideTab=el.dataset.t||null;ui.sideOver=true;ui.rpOver=false;render()},
 sidetab:el=>{if(el.dataset.t==='Bible'){ui.sideTab='Bible';ui.sbOpen=null;ui.sbTest=null;if(!ui.sideOver&&!(WIDE.matches&&sideDocked())){ui.sideOver=true}render();return}
  ui.sideTab=el.dataset.t;if(el.dataset.t==='Devotional'&&ui.view!=='devo'&&ui.view!=='devmode'){ui.view='devo';ui.sideTab=null;ui.sideOver=false;closeSheet();clearOwnSel();lastKey=''}render()},
 rpbtn:()=>{if(WIDE.matches&&!focusOn()){SET.rp=SET.rp===false;saveSet();ui.rpOver=false}else{ui.rpOver=!ui.rpOver;ui.sideOver=false}render()},
 rpopen:el=>{closeMenu();ui.rpTab=el.dataset.t||'notes';if(!rpDocked())ui.rpOver=true;render()},
 rptab:el=>{ui.rpTab=el.dataset.t;render()},
 rpclose:()=>{ui.rpOver=false;render()},
 focus:()=>{closeMenu();if(ui.view==='bible'||ui.view==='devmode'){const k=ui.view==='bible'?'__bible':'__devo';SET.focus[k]=!SET.focus[k];saveSet();hideBar();clearOwnSel();render();return}const st=cur();if(!st)return;SET.focus[st.id]=!SET.focus[st.id];if(!SET.focus[st.id])delete SET.focus[st.id];saveSet();ui.sideOver=false;ui.rpOver=false;hideBar();clearOwnSel();render()},
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
 bcolor:el=>{const i=+el.dataset.c,c=PALETTE[i];if(ui.bar.mode==='new'){applyMark('highlight',i);return}const a=findAnn(ui.bar.id);if(!a)return;if(a.kind==='highlight'&&String(a.color).toLowerCase()===c){removeAnn(a);return}ui.color=i;commit({op:'upd',sid:cur().id,id:a.id,patch:{color:c}});render();bar.innerHTML=barHtml()},
 bkind:el=>{const k=el.dataset.k;if(ui.bar.mode==='new'){applyMark(k,null);return}const a=findAnn(ui.bar.id);if(!a)return;if(a.kind===k){removeAnn(a);return}commit({op:'upd',sid:cur().id,id:a.id,patch:{kind:k}});render();bar.innerHTML=barHtml()},
 bmore:()=>{ui.barMore=true;bar.innerHTML=barHtml();placeBar()},
 bnote:()=>{const id=ui.bar&&ui.bar.id;if(id)openEd(id)},
 etag:el=>{const st=cur(),a=findAnn(ui.edit);if(!a)return;const t=el.dataset.t,has=(a.tags||[]).includes(t);const tags=has?a.tags.filter(x=>x!==t):[...(a.tags||[]),t];const patch={tags};if(has&&a.titleTag===t)patch.titleTag=tags[0]||'';commit({op:'upd',sid:st.id,id:a.id,patch});render();renderEd()},
 txt:()=>{closeEd(true);hideBar();const x=$('#tx');if(x.classList.contains('open')){x.classList.remove('open');return}x.innerHTML=txtHtml();x.classList.add('open')},
 txtx:()=>$('#tx').classList.remove('open'),
 tfont:el=>(ui.txPage=null,0)||setText({font:el.dataset.k}),
 tsize:el=>setText({size:Math.max(.8,Math.min(1.6,Math.round((tset().size+(+el.dataset.d)*.05)*100)/100))}),
 tlh:el=>setText({lh:el.dataset.v}),
 tvn:el=>setText({vn:el.dataset.v==='1'}),
 treset:()=>{LS.set('text',{...TDEF});applyText();render();refreshTx($('#tx'))},
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
 dbub:()=>{SET.devBub=SET.devBub===false;saveSet();closeMenu();render();const x=$('#tx');if(x.classList.contains('open'))refreshTx(x)},
 dmargin:el=>{SET.devMargin=el&&el.dataset&&el.dataset.v!=null?el.dataset.v==='1':SET.devMargin===false;saveSet();closeMenu();render();const x=$('#tx');if(x.classList.contains('open'))refreshTx(x)},
 dlight:el=>{SET.devLight=el.dataset.v;saveSet();render();const x=$('#tx');if(x.classList.contains('open'))refreshTx(x)},
 vwrite:el=>{const st=cur();if(!st)return;const p=st.passages[0],tr=(st.translations||[])[0]||devoTr(),c=+el.dataset.c,v=+el.dataset.v;const ex=(st.annotations||[]).find(a=>a.kind==='note'&&(a.spans||[]).some(sp=>sp.tr===tr&&sp.c===c&&sp.v===v&&sp.s<=0&&sp.e>=((CH[chKey(tr,p.ref.b,c)]||{v:[]}).v[v-1]||'').replace(/\s+$/,'').length-1));if(ex){openEd(ex.id);return}const t=((CH[chKey(tr,p.ref.b,c)]||{v:[]}).v[v-1])||'';const a={id:newId(),kind:'note',color:'#5bba88',spans:[{tr,b:p.ref.b,c,v,s:0,e:t.length,text:t}],note:'',tags:[],created:new Date().toISOString()};commit({op:'add',sid:st.id,a});ui.justMade=a.id;openEd(a.id)},
 mwedit:el=>openEd(el.dataset.id),
 ekind:el=>{const st=cur(),a=findAnn(ui.edit);if(!a)return;commit({op:'upd',sid:st.id,id:a.id,patch:{kind:el.dataset.k}});rerender();const n=$('#enote');if(n)n.focus()},
 tagmenu:el=>{const a=findAnn(el.dataset.id);if(!a)return;const t=el.dataset.t,pinned=a.titleTag===t,id=esc(a.id),tt=esc(t);const m=$('#menu');m.dataset.k='tag';
  m.innerHTML=`<div class="msec">#${tt}</div><button class="mi" data-act="tagpin" data-id="${id}" data-t="${tt}"${pinned?' data-on="1"':''}><span class="ck">${ic('pin',15)}</span><span>${pinned?'Unpin the title':'Pin as the title'}</span></button><div class="msec">Color for this tag</div><div class="mswr">${PALETTE.map((c,i)=>`<button class="esw" style="background:${c}" data-act="tagcolor" data-t="${tt}" data-c="${i}" aria-label="Color ${i+1}"></button>`).join('')}</div><div class="mhr"></div><button class="mi" data-act="managetags"><span class="ck">${ic('tag',15)}</span><span>Manage tags…</span></button><button class="mi red" data-act="tagremove" data-id="${id}" data-t="${tt}"><span class="ck">${ic('trash',15)}</span><span>Remove from this note</span></button>`;
  m.classList.remove('asSheet');m.classList.add('open');const r=el.getBoundingClientRect(),w=m.offsetWidth||230,h=m.offsetHeight||240;m.style.top=(r.bottom+6+h>innerHeight-10?Math.max(8,r.top-h-6):r.bottom+6)+'px';m.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px'},
 bopenlist:()=>{ui.view='bible';ui.bibList=true;ui.bpickB=bibleRef().b;ui.bibTest=null;ui.sideOver=false;lastKey='';render()},
 blistx:()=>{ui.bibList=false;render()},
 btest:el=>{ui.bibTest=el.dataset.t;ui.bpickB=null;render()},
 bpage:el=>{LS.set('bibPage',el.dataset.v);render();const x=$('#tx');if(x&&x.classList.contains('open'))refreshTx(x)},
 bmark:el=>{const st=S.studies[el.dataset.sid]&&S.studies[el.dataset.sid].d;if(!st)return;const a=(st.annotations||[]).find(x=>x.id===el.dataset.m);if(!a)return;const sp=a.spans[0];const p=(st.passages||[]).find(p=>p.ref&&p.ref.b===sp.b)||{};
  const m=$('#menu');m.dataset.k='bmark';m.innerHTML=`<div class="bmtip"><b>In “${esc(st.title||'Untitled')}”</b><span>${esc(KLABEL[a.kind]||a.kind)}${a.note?' · '+esc(plainMd(a.note).slice(0,120)):''}</span><button class="quiet" data-act="goto" data-s="${esc(st.id)}" data-p="${esc(p.id||'')}" data-c="${sp.c}" data-v="${sp.v}" data-m="${esc(a.id)}">Open the study →</button></div>`;m.classList.remove('asSheet');m.classList.add('open');const r=el.getBoundingClientRect(),w=m.offsetWidth||260;m.style.top=Math.min(r.bottom+6,innerHeight-(m.offsetHeight||120)-10)+'px';m.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px'},
 bcontinue:()=>{const ba=LS.get('bibAt',null);if(!ba)return;ui.bib={b:ba.b,c:ba.c};ui.bibChs=null;ui.bibList=false;ui.view='bible';ui.bibToday=null;lastKey='';render();const go=(n)=>{const el=document.getElementById(`bv-${ba.b}-${ba.c}-${ba.v}`);if(el){el.scrollIntoView({block:'start'});const bd=$('#body');if(bd)bd.scrollTop-=70;toast(`Back where you left off · ${bname(ba.b,true)} ${ba.c}:${ba.v}`)}else if(n<20)setTimeout(()=>go(n+1),150)};if(ba.v>1)go(0)},
 hrec:el=>{const k=el.dataset.k,id=el.dataset.id;if(k==='study')return A.open({dataset:{s:id}});if(k==='devo')return A.devopen({dataset:{s:id}});if(k==='bible'){const [b,c]=id.split(':').map(Number);return A.bgo({dataset:{b,c}})}},
 dwhole:()=>{closeMenu();const st=S.studies[ui.devSid]&&S.studies[ui.devSid].d;const r=st&&devRef(st);if(!r)return;ui.bibToday={b:r.b,c:r.c1,v1:r.v1,v2:r.c2===r.c1?r.v2:999,sid:st.id,tr:studyTr(st)};ui.bib={b:r.b,c:r.c1};ui.bibChs=null;ui.bibList=false;ui.view='bible';lastKey='';render();if(r.v1>3)setTimeout(()=>{const el=document.getElementById(`bv-${r.b}-${r.c1}-${r.v1}`);if(el){el.scrollIntoView({block:'start'});const bd=$('#body');if(bd)bd.scrollTop-=90}},250)},
 devback:()=>{const sid=ui.bibToday&&ui.bibToday.sid;ui.bibToday=null;if(sid)A.devopen({dataset:{s:sid}})},
 otopen:()=>{ui.otOpen=true;render();setTimeout(()=>{const n=$('#devnotes');if(n){n.focus();const r=document.createRange();r.selectNodeContents(n);r.collapse(false);const g=getSelection();g.removeAllRanges();g.addRange(r)}},60)},
 otclose:()=>{const ae=document.activeElement;if(ae&&ae.id==='devnotes')ae.blur();ui.otOpen=false;ui.pendRender=false;render()},
 share:()=>{closeMenu();shStart()},
 shclose:()=>closeShare(),
 shstyle:el=>{ui.sh.style=el.dataset.v;shRemember();renderShare()},
 shsize:el=>{ui.sh.size=el.dataset.v;shRemember();renderShare()},
 shbeside:el=>{ui.sh.beside=el.dataset.v==='1';shRemember();renderShare()},
 shpage:el=>{ui.sh.page=el.dataset.v;renderShare()},
 shcopy:()=>{const t=shText();(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Copied as text')).catch(()=>toast('Couldn’t copy here'))},
 shsave:async()=>{const b=await shBlob();if(!b){toast('Couldn’t make the image here');return}const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=shFileName();document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000)},
 shshare:async()=>{const b=await shBlob();if(!b){toast('Couldn’t make the image here');return}const f=new File([b],shFileName(),{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:shData().ref})}catch(e){}}else A.shsave()},
 newstudy:()=>{ui.sideOver=false;render();newStudyForm()},
 nstr:el=>{document.querySelectorAll('.nstr button').forEach(b=>b.classList.toggle('on',b===el))},
 nscreate:()=>createStudy(),
 bpick:()=>{ui.bibList=true;ui.bpickB=bibleRef().b;ui.bibTest=null;ui.sideOver=false;hideBar();clearOwnSel();render();setTimeout(()=>{const q=$('#bq');if(q&&!('ontouchstart' in window))q.focus()},50)},
 bbook:el=>{const b=+el.dataset.b;ui.bpickB=b<0?null:b;render()},
 bgo:el=>{ui.bpickB=null;ui.bibList=false;ui.view='bible';ui.sideOver=false;bibJump(+el.dataset.b,+el.dataset.c,'fade')},
 spill:()=>{if(ui._cmdLP&&Date.now()-ui._cmdLP<900)return;ui.spOpen=!ui.spOpen;$('#fx').innerHTML=fxHtml();spTimer()},
 cmdopen:()=>openCmd(),
 cmdclose:()=>closeCmd(),
 cmdpick:el=>{const it=cmdList[+el.dataset.i];if(it)cmdRun(it)},
 txpage:el=>{ui.txPage=el.dataset.p;refreshTx($('#tx'))},
 txback:()=>{ui.txPage=null;refreshTx($('#tx'))},
 dsettr:el=>{const t=el.dataset.tr,st=S.studies[ui.devSid]&&S.studies[ui.devSid].d;if(!st)return;if(!trAvailable(t)){toast(`Add the key in Settings to read ${trName(t)}`);return}commit({op:'set',sid:st.id,patch:{translations:[t,...(st.translations||[]).filter(x=>x!==t)]}});ui.txPage=null;render()},
 dcm:el=>{const v=el.dataset.v;SET.devHide=v==='hidden';if(v!=='hidden')SET.devMargin=v==='beside';saveSet();render()},
 devday:el=>{const s=devFor(el.dataset.k);if(s)A.devopen({dataset:{s:s.id}})},
 bprevch:()=>{const p=bibPrev(ui.bibChs[0][0],ui.bibChs[0][1]);if(p)bibJump(p[0],p[1],'prev')},
 bqpick:el=>{const i=$('#'+el.dataset.for);if(i){i.value=BOOKS[+el.dataset.b]+' ';i.focus();autofill(i)}},
 sbtest:el=>{ui.sbTest=el.dataset.t;ui.sbOpen=-1;render()},
 dset:()=>{ui.dsetOpen=!ui.dsetOpen;render();clearTimeout(ui._dsetT);if(ui.dsetOpen)ui._dsetT=setTimeout(()=>{if(ui.dsetOpen&&!$('#menu.open')){ui.dsetOpen=false;render()}},6000)},
 sbbook:el=>{ui.sbOpen=+el.dataset.b;render()},
 sbgo:el=>{ui.bibToday=null;ui.bibList=false;ui.view='bible';if(!WIDE.matches)ui.sideOver=false;bibJump(+el.dataset.b,+el.dataset.c,'fade')},
 bstep:el=>{ui.bibToday=null;const r=bibleRef(),d=+el.dataset.d,n=d>0?bibNext(r.b,r.c):bibPrev(r.b,r.c);if(n)bibJump(n[0],n[1],d>0?'next':'prev')},
 bretry:()=>{const r=bibleRef();delete CHERR[chKey(bibleTr(),r.b,r.c)];render()},
 bsettr:el=>{ui.txPage=null;closeMenu();ui.bibToday=null;LS.set('bibTr',el.dataset.tr);render()},
 bstudy:el=>{const r=el.dataset.b?{b:+el.dataset.b,c:+el.dataset.c}:bibleRef(),hit=versesInStudies(r.b,r.c)[+el.dataset.v]||[];if(hit.length===1){A.goto({dataset:{s:hit[0].sid,p:hit[0].pid,c:r.c,v:el.dataset.v}});return}
  const m=$('#menu');m.dataset.k='bstudy';m.innerHTML=`<div class="msec">In your studies</div>`+hit.map(h=>`<button class="mi" data-act="goto" data-s="${esc(h.sid)}" data-p="${esc(h.pid)}" data-c="${r.c}" data-v="${el.dataset.v}"><span class="ck"></span><span>${esc(h.title)}</span></button>`).join('');m.classList.remove('asSheet');m.classList.add('open');const b=el.getBoundingClientRect();m.style.top=Math.min(b.bottom+6,innerHeight-(m.offsetHeight||160)-10)+'px';m.style.left=Math.max(8,Math.min(b.left,innerWidth-(m.offsetWidth||220)-8))+'px'},
 bnewsel:()=>{const sl=ui.sel;hideBar();clearOwnSel();newStudyForm({ref:selRefStr(sl),tr:bibleTr()})},
 bcopysel:()=>{const sl=ui.sel;const txt=`“${sl.w}” ${selRefStr(sl)} (${trName(bibleTr())})`;hideBar();clearOwnSel();(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast('Copied')).catch(()=>toast('Couldn’t copy here'))},
 ndot:el=>{const id=el.dataset.m;if(ui.dotOpen.has(id)){ui.dotOpen.delete(id);if(ui.selCard===id)ui.selCard=null}else{ui.dotOpen.add(id);ui.selCard=id;ui.unfold.add(id)}render()},
 scrinfo:()=>{ui.scrInfo=true;render()},
 edpop:()=>{ui.edPop=!ui.edPop;rerender()},
 tagadd:()=>{ui.tagAdd=true;rerender();const i=$('#etagin');if(i){i.focus();showTagSug('',i)}},
 tagpick:el=>{const fromHash=!$('#etagin');addTag(el.dataset.t,fromHash);if(fromHash){const n=$('#enote');if(n)n.focus()}else{ui.tagAdd=false;rerender()}},
 tagpin:el=>{closeMenu();const a=findAnn(el.dataset.id);if(!a)return;commit({op:'upd',sid:cur().id,id:a.id,patch:{titleTag:el.dataset.on?'':el.dataset.t}});rerender()},
 tagremove:el=>{closeMenu();const a=findAnn(el.dataset.id);if(!a)return;const t=el.dataset.t;const patch={tags:(a.tags||[]).filter(x=>x!==t)};if(a.titleTag===t)patch.titleTag='';commit({op:'upd',sid:cur().id,id:a.id,patch});rerender()},
 tagcolor:el=>{closeMenu();const st=cur();if(!st)return;commit({op:'set',sid:st.id,patch:{tagColors:Object.assign({},st.tagColors||{},{[el.dataset.t]:PALETTE[+el.dataset.c]})}});rerender()},
 managetags:()=>{closeMenu();ui.mtColor=null;manageTags()},
 mtcolor:el=>{ui.mtColor=ui.mtColor===el.dataset.t?null:el.dataset.t;manageTags()},
 mtsetcolor:el=>{const t=el.dataset.t,c=PALETTE[+el.dataset.c];const ids=new Set();forEachTagged(t,s=>ids.add(s.id));studyList().forEach(s=>{if(ids.has(s.id)||(s.tagColors||{})[t])commit({op:'set',sid:s.id,patch:{tagColors:Object.assign({},s.tagColors||{},{[t]:c})}})});ui.mtColor=null;manageTags();render()},
 mtrename:el=>{const t=el.dataset.t;const v=(prompt(`Rename #${t} to:`,t)||'').replace(/^#/,'').trim();if(!v||v===t)return;forEachTagged(t,(s,a)=>{const tags=[...new Set((a.tags||[]).map(x=>x===t?v:x))];const patch={tags};if(a.titleTag===t)patch.titleTag=v;commit({op:'upd',sid:s.id,id:a.id,patch})});studyList().forEach(s=>{const tc=s.tagColors||{};if(tc[t]&&!tc[v]){const n=Object.assign({},tc,{[v]:tc[t]});delete n[t];commit({op:'set',sid:s.id,patch:{tagColors:n}})}});FS.tags.delete(t);manageTags();render();toast(`Renamed #${t} to #${v}`)},
 mtdelete:el=>{const t=el.dataset.t;const undo=[];forEachTagged(t,(s,a)=>{undo.push([s.id,a.id,{tags:[...(a.tags||[])],titleTag:a.titleTag||''}]);const patch={tags:(a.tags||[]).filter(x=>x!==t)};if(a.titleTag===t)patch.titleTag='';commit({op:'upd',sid:s.id,id:a.id,patch})});FS.tags.delete(t);manageTags();render();toast(`Deleted #${t}`,()=>{undo.forEach(([sid,id,patch])=>commit({op:'upd',sid,id,patch}));manageTags();render()})},
 fmtb:el=>{const s=getSelection();const host=s.anchorNode&&(s.anchorNode.nodeType===1?s.anchorNode:s.anchorNode.parentElement);const box=host&&host.closest('#enote,#devnotes,#rpnotes');if(!box)return;document.execCommand(el.dataset.k,false,null);box.dispatchEvent(new Event('input',{bubbles:true}));placeBiu()},
 ecol:el=>{const st=cur(),a=findAnn(ui.edit);if(!a)return;commit({op:'upd',sid:st.id,id:a.id,patch:{color:PALETTE[+el.dataset.c]}});rerender();renderEd()},
 eline:el=>{const st=cur(),a=findAnn(ui.edit);if(!a)return;commit({op:'upd',sid:st.id,id:a.id,patch:{line:{...(a.line||{}),style:el.dataset.v}}});render();renderEd()},
 bub:el=>openEd(el.dataset.id),
 goto:el=>{ui.sid=el.dataset.s;const st=cur();if(st&&el.dataset.tr&&TRS[el.dataset.tr]){SET.tr[st.id]=el.dataset.tr;saveSet()}ui.view='study';ui.tab='passage';fsReset();if(el.dataset.m)ui.unfold.add(el.dataset.m);ui.flashV=`${el.dataset.p}-${el.dataset.c}-${el.dataset.v}`;lastKey='';render()},
 gonotes:el=>{ui.sid=el.dataset.s;ui.view='study';ui.tab='passage';ui.rpTab='notes';if(!rpDocked())ui.rpOver=true;lastKey='';render()}
};
document.addEventListener('click',e=>{
 const inMenu=e.target.closest('#menu'),inEd=e.target.closest('#ed')||e.target.closest('.mw.editing')||e.target.closest('.nc.ed')||e.target.closest('#tsug')||e.target.closest('#biu')||(e.target.closest('#menu')&&ui.edit),inBar=e.target.closest('#mbar');
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
if((focusOn()||ui.view==='devmode')&&!inMenu&&!e.target.closest('#pill,button,.nc,.vtx [data-m],#mbar')){const fx=$('#fx');if(fx)fx.classList.remove('hide')}
 if(ui.view==='devmode'&&!inMenu&&!inBar&&!inEd&&!e.target.closest('#tx,.vtx,.mw,.copen,#devnotes,.dctl,button,input,a')){const s=getSelection();if(!s||s.isCollapsed)devShowCtl(!ui.devCtl)}
});
document.addEventListener('input',e=>{
 const t=e.target;
 if(t.id==='rpnotes'){const st=cur();if(st)commit({op:'set',sid:st.id,patch:{outline:htmlToMd(t)}});return}
 if(t.id==='devnotes'){t.querySelectorAll('p.hp').forEach(x=>{if(x.textContent.trim())x.classList.remove('hp')});const st=cur();if(st)commit({op:'set',sid:st.id,patch:{outline:htmlToMd(t)}})}
 else if(t.id==='eabove'){const st=cur();if(st&&ui.edit){commit({op:'upd',sid:st.id,id:ui.edit,patch:{above:t.value}});const m=document.querySelector(`.vtx [data-m="${ui.edit}"]`);if(m)m.dataset.above=t.value}}
 else if(t.id==='etagin'){showTagSug(t.value.replace(/^#/,''),t);return}
 else if(t.id==='enote'){setTimeout(()=>{const h=hashBeforeCaret();if(h&&ui.view==='study'){const r=document.createRange();r.setStart(h.node,h.start);r.setEnd(h.node,h.end);showTagSug(h.q,r)}else hideTagSug()},0);if(ui.view==='devmode')alignMargin();const st=cur();if(st&&ui.edit)commit({op:'upd',sid:st.id,id:ui.edit,patch:{note:htmlToMd(t)}})}
 else if(t.id==='q'){ui.q=t.value;$('#res').innerHTML=results()}
 else if(t.id==='tsz'){LS.set('text',Object.assign(tset(),{size:+t.value}));applyText();$('#tszv').textContent=Math.round(t.value*100)+'%'}
 else if(t.dataset&&t.dataset.f&&ui.dr){ui.dr.f[t.dataset.f]=t.value}
});
document.addEventListener('keydown',e=>{
 if(e.target.id==='gopass'&&e.key==='Enter'){e.preventDefault();A.goopen();return}
 if((e.target.id==='enote'||e.target.id==='etagin')&&$('#tsug.show')&&(e.key==='Enter'||e.key==='Tab')){e.preventDefault();const f=$('#tsug button');if(f)f.click();return}
 if(e.key==='Escape'&&$('#tsug.show')){hideTagSug();return}
 if(e.target.id==='etagin'&&e.key==='Enter'&&false){e.preventDefault();const v=e.target.value.trim().replace(/^#/,'');if(!v)return;const st=cur(),a=findAnn(ui.edit);if(a&&!(a.tags||[]).includes(v))commit({op:'upd',sid:st.id,id:a.id,patch:{tags:[...(a.tags||[]),v]}});render();renderEd();const n=$('#etagin');if(n)n.focus();return}
 if((e.ctrlKey||e.metaKey)&&['b','i'].includes(e.key.toLowerCase())){
  if(e.target.id==='enote'){e.preventDefault();document.execCommand(e.key.toLowerCase()==='b'?'bold':'italic');e.target.dispatchEvent(new Event('input',{bubbles:true}));return}
  if(e.target.tagName==='TEXTAREA'){e.preventDefault();fmtText(e.target,e.key.toLowerCase());return}
 }
 if((e.ctrlKey||e.metaKey)&&e.key==='Enter'&&e.target.id==='enote'){e.preventDefault();closeEd();return}
 if(e.key==='Enter'&&e.target.classList&&e.target.classList.contains('nc')){A.card(e.target);return}
 if(e.key==='Escape'){if($('#menu').classList.contains('open'))closeMenu();else if($('#tx').classList.contains('open'))$('#tx').classList.remove('open');else if(ui.edit)closeEd();else if(ui.bar)hideBar();else if(ui.view==='devmode'&&!/INPUT|TEXTAREA/.test(e.target.tagName)&&e.target.id!=='devnotes')devExit();else if($('#wn').classList.contains('open'))$('#wn').classList.remove('open')}
});
let lastTop=0;
$('#body').addEventListener('scroll',()=>{const b=$('#body');$('#bar').classList.toggle('scrolled',b.scrollTop>4);$('#app').classList.toggle('scrolled',b.scrollTop>70);if(ui.spOpen&&!$('#menu.open')&&!$('#tx.open')&&Math.abs(b.scrollTop-lastTop)>30){ui.spOpen=false;$('#fx').innerHTML=fxHtml()}if(focusOn()||ui.view==='devmode'){const fx=$('#fx');if(fx){if(b.scrollTop<=24||(b.scrollHeight>b.clientHeight+50&&b.scrollTop+b.clientHeight>=b.scrollHeight-8)||b.scrollTop<lastTop-14)fx.classList.remove('hide');else if(b.scrollTop>lastTop+2&&!ui.spOpen)fx.classList.add('hide')}}lastTop=b.scrollTop;if(ui.selDrag)drawSel();if(ui.bar)placeBar();closeMenu();bibTrack();},{passive:true});
document.addEventListener('focusout',e=>{if(e.target&&['devnotes','enote','rpnotes','bq','gopass','shtt','shnm'].includes(e.target.id)&&ui.pendRender)setTimeout(()=>{if(document.activeElement.id!=='enote'&&document.activeElement.id!=='devnotes')render()},0)});
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
 '1.7.0':['The command box: ⌘K on the iPad, or the search icon in any settings button (pull down on a heading, or hold the settings button), to go anywhere, do things and change settings.','Reading settings (Aa) in one light style on every page: this page’s choices first, the text look below; translation and font open as lists.','Devotional: “Devotional › date” with nearby days at the top; sunrise and journal icons; its settings button fades while you read.'],
 '1.6.7':['Fix: selected text shows its tint and handles again (1.6.5 drew them on a hidden layer).'],
 '1.6.6':['Georgia, Charter and Palatino now look like themselves on every device.','The Bible’s page colors are Light, Sepia, Dark and Black.','Fixes: the notes display switch, every translation in Aa, devotional word comments beside their verse, text no longer showing above the toolbar; the devotional’s progress line is gone.'],
 '1.6.5':['One settings button at the bottom right on every reading page, with Focus in and out shown by its icon; pages start with their own heading instead of a top bar.','The Bible: scrolling from one chapter into the next is smooth (chapters are added in place); select across verses to start a study or copy; the passage line fills in book names.','Studies: Focus uses the full width; Aa holds the translation, layout and how notes show.'],
 '1.6.4':['Devotional: always the calm reading view, with one settings button at the bottom right (Today, Aa, Share, your overall thoughts, ⋯).','Studies: the Verses, translation, Margin, Filter and Collapse controls are back above the columns; Focus is in ⋯.','The Bible: a comfortable reading width on iPad, calmer scrolling, stronger highlights on light pages.','Share: marks keep their colors and notes sit beside their verses.'],
 '1.6.3':['The Bible: one slim line, chapters that run on as you scroll, eight page colors, and the book list in the sidebar.','Studies and the devotional: one slim line too. Focus sits at the bottom right everywhere and turns into a small pill of tools.','Back on your phone now goes back inside the app.','Home is the house at the bottom right of the sidebar.'],
 '1.6.2':['Share: the verse pickers work again, including readings that cross into the next chapter, and show their verses clearly.'],
 '1.6.1':['Fixes in the devotional and the Bible: the overall thoughts pen is readable in the dark and no longer covers Done; Read the whole chapter keeps your Bible translation; verse numbers have their space again; the evening page darkens the top bar too; See my notes opens your thoughts.'],
 '1.6.0':['Home: Marginalia opens to today’s reading, the study you were in, your place in the Bible and everything recent.','The Bible: tap the reference for a simple book list; your study marks show softly on the text; it remembers where you stopped; next chapter at the end (or swipe); Aa adds a page color.','Devotional: Overall thoughts wait as a small pen at the side; Read the whole chapter; Share this reading as an image or text.','Focus: leave it from the same top-right spot you entered it.'],
 '1.5.0':['The Bible: a Bible tab in the sidebar opens any book and chapter. Dots by verses in your studies open them; select words to start a study there.','New study: in the sidebar’s Studies tab. Type a passage, then a title, series and translation.','Edit your Study notes in the right panel; drag its edge (or the sheet on a phone) to resize it.','Notes as dots: Margin ▾ > Dots shows a small colored dot for each note; tap it to open the note.'],
 '1.4.8':['iPad: the band at the bottom of the window should be gone: the app now fills the strip the iPad was leaving empty.'],
 '1.4.7':['On iPad, drag the line between the scripture and the notes to make the notes wider (double-tap it to reset).','Editing a note is a line shorter: the mark and its color sit by the title; tap them for all kinds and colors.','Settings is at the bottom of the sidebar.','Fixed: Settings and Devotional in the sidebar did nothing on a phone.'],
 '1.4.6':['The app now fills the whole window down to the bottom edge, and the top bar lines up with the sidebar.'],
 '1.4.5':['Edit a note right in its card: ••• > Edit note. The mark’s kind and color sit along the top, its tags along the bottom.','Select words in a note for a small B · I · U pop-up.','Tags like the desktop’s: type # in a note for your tags, tap a tag to pin it as the title, give it a color or remove it, and Manage tags… to rename, merge, recolor or delete across studies.'],
 '1.4.4':['Focus and the devotional now use the whole screen: the text scrolls all the way to the bottom edge and under the clock, instead of stopping short.'],
 '1.4.3':['Fixed: after selecting words, the first tap on a color now marks them (it used to take two taps).'],
 '1.4.2':['Selecting words now shows the selection everywhere, including the devotional.','Tapping a color on an underline, circle or comment recolors it; the highlighter turns it into a highlight.','The page runs under the clock and down to the bottom edge, with no bands (remove and re-add the app to the Home Screen once).'],
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
const focusOn=()=>(ui.view==='study'&&!!SET.focus[ui.sid]&&!!cur())||(ui.view==='bible'&&!ui.bibList&&!!SET.focus.__bible);
const sideDocked=()=>WIDE.matches&&SET.side!==false&&!focusOn();
const rpDocked=()=>WIDE.matches&&SET.rp!==false&&ui.view==='study'&&!focusOn();
const rpShown=()=>ui.view==='study'&&(rpDocked()||ui.rpOver);

/* ---------- top bar: the desktop's slim bar ---------- */
function topbar(title,opt={}){
 const sideOn=WIDE.matches?sideDocked():ui.sideOver;
 const name=title?`<div class="bt">${title}</div>`:`<div class="bname">Marginalia</div>`;
 return `<button class="ib${sideOn?' on':''}" data-act="sidebtn" aria-label="Sidebar" title="Sidebar">${ic('side',18)}</button>${name}${(account||CFG.clientId)?syncDot():''}<span class="sp"></span>${opt.extra||''}${opt.focus?`<button class="fbtn" data-act="focus" aria-label="Focus" title="Focus: just the page">${ic('focus',17)}<span class="lab">Focus</span></button>`:''}${ib('search','nav','Search','data-v="search"')}${opt.rp?`<button class="ib${rpShown()?' on':''}" data-act="rpbtn" aria-label="Study notes and Guide" title="Study notes and Guide">${ic('rside',18)}</button>`:''}`;
}

/* ---------- sidebar: Studies · Devotional, like the desktop's ---------- */
function sideHtml(){
 const t=ui.sideTab||(['devo','devmode'].includes(ui.view)?'Devotional':ui.view==='bible'?'Bible':'Studies');
 const tabs=`<div class="stabs"><button class="${t==='Studies'?'on':''}" data-act="sidetab" data-t="Studies">Studies</button><button class="${t==='Bible'?'on':''}" data-act="sidetab" data-t="Bible">Bible</button><button class="${t==='Devotional'?'on':''}" data-act="sidetab" data-t="Devotional">Devotional</button></div>`;
 let inner='';
 if(t==='Bible'){inner=sideBibleHtml()}
 else if(t==='Studies'){
  const list=studyList(),open=ui.view==='study'?cur():null;
  inner=`<button class="newst" data-act="newstudy">${ic('plusI',16)}New study</button>`+(open?`<div class="scard"><b>${esc(open.title||'Untitled')}</b><small>${esc((open.passages||[]).map(p=>refStr(p.ref)).join(', '))} · ${(open.annotations||[]).length} marks</small>${(open.passages||[]).map(p=>`<div class="pchip">${esc(refStr(p.ref))}</div>`).join('')}</div>`:'')+
   (list.filter(s=>!open||s.id!==open.id).map(s=>`<button class="srow" data-act="open" data-s="${esc(s.id)}">${esc(s.title||'Untitled')}<small>${esc((s.passages||[]).map(p=>refStr(p.ref)).join(', '))}</small></button>`).join('')||(open?'':'<p class="muted" style="padding:4px 8px;font-size:13px">No studies yet.</p>'));
 }else{
  inner=`<button class="srow strong" data-act="nav" data-v="devo">${ic('cal',17)}Today’s reading</button>${devCalCard()}${devPlanCard()}`;
 }
 return `${tabs}<div class="sbody">${inner}</div><div class="sfoot2"><div class="sfl"><button class="srow" data-act="nav" data-v="settings">${ic('sliders',16)}Settings</button>${syncLine()}</div><button class="homeic${ui.view==='home'?' on':''}" data-act="nav" data-v="home" aria-label="Home" title="Home">${ic('homeI',20)}</button></div>`;
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
 if(ui.rpTab==='notes')body=rpNotesHtml(st);
 else{
  const tr=studyTr(st),anns=(st.annotations||[]).filter(a=>(a.spans||[]).some(s=>s.tr===tr));
  const tags={};(st.annotations||[]).forEach(a=>(a.tags||[]).forEach(t=>tags[t]=(tags[t]||0)+1));
  const notes=anns.filter(a=>a.note).sort((a,b)=>{const x=a.spans[0],y=b.spans[0];return (x.c-y.c)||(x.v-y.v)||(x.s-y.s)});
  body=`${st.summary?`<div class="gcard"><div class="gl">Summary</div><div>${md(st.summary)}</div></div>`:''}${Object.keys(tags).length?`<div class="gcard"><div class="gl">Tags</div><div class="xchips">${Object.entries(tags).map(([t,n])=>`<button data-act="gtag" data-t="${esc(t)}">#${esc(t)} <small>${n}</small></button>`).join('')}</div></div>`:''}<div class="gcard"><div class="gl">Notes in this study</div>${notes.length?notes.map(a=>{const sp=a.spans.find(s=>s.tr===tr)||a.spans[0];const p=(st.passages||[]).find(p=>p.ref&&p.ref.b===sp.b)||{};return `<button class="gnote" data-act="goto" data-s="${esc(st.id)}" data-p="${esc(p.id||'')}" data-c="${sp.c}" data-v="${sp.v}" data-m="${esc(a.id)}"><small>${esc(bname(sp.b,true))} ${sp.c}:${sp.v}</small><span class="gq">${esc(sp.text||'')}</span><span class="gn">${esc(plainMd(a.note).slice(0,140))}</span></button>`}).join(''):'<p class="muted" style="margin:4px 0 0">No notes yet.</p>'}</div>`;
 }
 return `<div class="rpgrip ${!MID.matches&&ui.rpOver?'sheet':'side'}" aria-hidden="true"></div>${tabs}<div class="rbody">${body}</div>`;
}

/* ---------- the study page ---------- */
function headerRow(st,tr){
 const t=tset(),fold=SET.fold!==false,fon=filterOn();
 const filt=FS.just?`<button class="hq on fchip" data-act="fjust">${ic('eyeoff',14)}Just the text<span class="fx2">${ic('x',12)}</span></button>`:fon?`<span class="fchip2"><button class="hq on" data-act="menu" data-m="filter">${ic('solid/filter',14)}${esc(filterLabel())} · ${filterCount(st)}</button><button class="hq on fx3" data-act="fclear" aria-label="Clear the filter">${ic('x',12)}</button></span>`:`<button class="hq" data-act="menu" data-m="filter">Filter</button>`;
 return `<div class="hrow"><div class="hl"><button class="hm strong" data-act="menu" data-m="layout">${curLayout()==='para'?'Paragraphs':'Verses'} ▾</button><button class="hm" data-act="menu" data-m="tr">${esc(trName(tr))} ▾</button></div><div class="hr"><button class="hm midonly" data-act="menu" data-m="nlay">${SET.nlay==='under'?'Under':'Margin'} ▾</button><span class="sp"></span>${filt}<button class="hq" data-act="fold">${fold?'Expand':'Collapse'}</button></div></div>`;
}
function ncolStyle(){return SET.ncol&&MID.matches&&SET.nlay!=='under'?` style="--ncol:${SET.ncol}px"`:''}
function vStudy(){
 const st=cur();if(!st){ui.view='studies';return vStudies()}
 const tr=studyTr(st);ui.tab='passage';
 let body=`${banners()}<div class="studywrap"${ncolStyle()}><div class="shd"><div class="ser">${esc(st.series||'')}</div><div class="ttl">${esc(st.title||'Untitled')}</div><div class="ref">${esc((st.passages||[]).map(p=>refStr(p.ref)).join(', '))}</div>${st.summary?`<button class="qsum${ui.sumOpen?' open':''}" data-act="sum">${esc(plainMd(st.summary))}</button>`:''}</div>${headerRow(st,tr)}`;
 (st.passages||[]).forEach(p=>{if((st.passages||[]).length>1)body+=`<div class="pref">${esc(refStr(p.ref))}</div>`;body+=passageRows(st,p,tr)});
 body+=`<div style="height:140px"></div>${MID.matches&&SET.nlay!=='under'?'<div class="coldiv" id="coldiv" role="separator" aria-orientation="vertical" aria-label="Scripture and notes width" title="Drag to change the width; double-tap to reset"><span class="knob"></span><span class="wtip"></span></div>':''}</div>`;
 return {bar:topbar(WIDE.matches?'':esc(st.title||'Untitled'),{focus:1,rp:1}),body};
}
function pillHtml(){
 if(ui.view==='bible')return `<button data-act="bstep" data-d="-1" aria-label="Previous chapter">${ic('chevL',16)}</button><button data-act="menu" data-m="btr">${esc(trName(bibleTr()))} ▾</button><button data-act="bstep" data-d="1" aria-label="Next chapter">${ic('chevR',16)}</button><button class="aa" data-act="txt" aria-label="Text settings">Aa</button><button data-act="menu" data-m="fmore" aria-label="More">${ic('more',17)}</button>`;
 const st=cur();if(!st)return '';
 return `<button data-act="menu" data-m="tr">${esc(trName(studyTr(st)))} ▾</button><button data-act="rpopen" data-t="notes">${ic('notesI',16)}Notes</button><button data-act="menu" data-m="filter" aria-label="Filter" class="${filterOn()||FS.just?'on':''}">${ic('filter',16)}</button><button class="aa" data-act="txt" aria-label="Text settings">Aa</button><button data-act="menu" data-m="fmore" aria-label="More">${ic('more',17)}</button>`;
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
function clearOwnSel(){ui.selDrag=null;if(window.CSS&&CSS.highlights)CSS.highlights.delete('mgsel');const k=$('#selk');if(k){k.classList.remove('show');k.innerHTML=''}}
/* Used by touch, Apple Pencil and mouse; also by tests. */
let lp=null,suppressUntil=0;
const suppressSoon=()=>{suppressUntil=Date.now()+450};
const selView=()=>ui.view==='study'||ui.view==='devmode'||ui.view==='bible';
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
  if(vn&&ui.view==='study'){suppressSoon();lp=null;verseMenu(vn);return}
  lp.active=startAt(lp.x,lp.y,lp.el);if(lp.active){if(navigator.vibrate)try{navigator.vibrate(8)}catch(x){}}
 },380);
},{passive:true});
document.addEventListener('touchmove',e=>{
 if(!lp)return;const t=e.touches[0];
 if(!lp.active){if(Math.hypot(t.clientX-lp.x,t.clientY-lp.y)>10){clearTimeout(lp.timer);lp=null}return}
 e.preventDefault();extendTo(t.clientX,t.clientY);
},{passive:false});
document.addEventListener('touchend',()=>{if(!lp)return;clearTimeout(lp.timer);const was=lp.active;lp=null;if(was){suppressSoon();if(ui.selDrag)ui.selDrag.handle=null;finishOwnSel()}},{passive:true});
document.addEventListener('touchcancel',()=>{if(lp){clearTimeout(lp.timer);lp=null}},{passive:true});
/* Mouse or trackpad: press and drag over words. */
let mdown=null;
document.addEventListener('mousedown',e=>{if(!selView()||e.button!==0||e.sourceCapabilities&&e.sourceCapabilities.firesTouchEvents)return;if(!(e.target.closest&&e.target.closest('.vtx')))return;mdown={x:e.clientX,y:e.clientY,el:e.target,active:false}});
document.addEventListener('mousemove',e=>{if(!mdown)return;if(!mdown.active){if(Math.hypot(e.clientX-mdown.x,e.clientY-mdown.y)<4)return;mdown.active=startAt(mdown.x,mdown.y,mdown.el);if(!mdown.active){mdown=null;return}}extendTo(e.clientX,e.clientY)});
document.addEventListener('mouseup',()=>{if(!mdown)return;const was=mdown.active;mdown=null;if(was){suppressSoon();finishOwnSel()}});
document.addEventListener('contextmenu',e=>{const vn=e.target.closest&&e.target.closest('.vn');if(vn&&ui.view==='study'){e.preventDefault();verseMenu(vn)}});
/* Only the click that ends a long-press is swallowed (some browsers send one); never a later tap, and never a tap on the colors or a menu. */
document.addEventListener('click',e=>{if(Date.now()<suppressUntil&&!(e.target.closest&&e.target.closest('#mbar,#menu,#selk'))){suppressUntil=0;e.stopImmediatePropagation();e.preventDefault()}},true);

/* ---------- the verse menu (long-press a verse number) ---------- */
function verseMenu(vn){
 const row=vn.nextElementSibling&&vn.nextElementSibling.classList.contains('vtx')?vn.nextElementSibling:vn.parentElement.querySelector('.vtx');if(!row)return;
 const st=cur();if(!st)return;const p=(st.passages||[]).find(x=>x.id===row.dataset.p)||st.passages[0];const c=+row.dataset.c,v=+row.dataset.v;
 const m=$('#menu');m.dataset.k='verse';
 m.innerHTML=`<div class="mhead"><b>${esc(bname(p.ref.b,true))} ${c}:${v}</b><button class="mqi" data-act="vcopy" data-p="${esc(p.id)}" data-c="${c}" data-v="${v}" aria-label="Copy verse" title="Copy verse">${ic('copyI',15)}</button></div><button class="mi" data-act="vnote" data-p="${esc(p.id)}" data-c="${c}" data-v="${v}"><span class="ck">${ic('note',16)}</span><span>Note on this verse</span></button><button class="mi" data-act="vcopy" data-p="${esc(p.id)}" data-c="${c}" data-v="${v}"><span class="ck"></span><span>Copy verse</span></button><button class="mi" data-act="vcopy" data-ref="1" data-p="${esc(p.id)}" data-c="${c}" data-v="${v}"><span class="ck"></span><span>Copy the reference</span></button>`;
 m.classList.remove('asSheet');m.classList.add('open');const r=vn.getBoundingClientRect(),w=m.offsetWidth||220;
 m.style.top=Math.min(r.bottom+6,innerHeight-(m.offsetHeight||170)-12)+'px';m.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px';
}
ICO['mg-tag']='<path d="M3 12V4h8l10 10-8 8z" stroke="currentColor" stroke-linejoin="round"/><circle cx="7.5" cy="8" r="1.3" stroke="currentColor"/>';IC_ALIAS.tag='mg-tag';
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
/* ===================== 1.4.5: notes edited in place, B · I · U, tags like the desktop's ===================== */
/* Re-render while the note box has focus (render() waits while you type). */
function rerender(){const ae=document.activeElement;if(ae&&/^(enote|etagin|devnotes|rpnotes)$/.test(ae.id))ae.blur();ui.pendRender=false;render()}
function tagStats(){const m={};studyList().forEach(s=>{(s.annotations||[]).forEach(a=>(a.tags||[]).forEach(t=>{m[t]=m[t]||{n:0,studies:new Set(),color:null};m[t].n++;m[t].studies.add(s.id)}));Object.entries(s.tagColors||{}).forEach(([t,c])=>{m[t]=m[t]||{n:0,studies:new Set(),color:null};if(!m[t].color)m[t].color=c})});return m}
const tagCol=t=>{const st=cur();return (st&&st.tagColors&&st.tagColors[t])||(tagStats()[t]||{}).color||'#6c7891'};
function tagChip(t,a,pinned){return `<button class="tgc${pinned?' pin':''}" style="--tc:${okHex(tagCol(t))}" data-act="tagmenu" data-t="${esc(t)}" data-id="${esc(a.id)}">${pinned?ic('pin',11):''}#${esc(t)}</button>`}
function editCardHtml(a){
 const tag=a.titleTag||(a.tags||[])[0],col=(tag&&tagCol(tag))||okHex(a.color);
 const words=(a.spans||[]).map(s=>s.text).filter(Boolean).join(' … ');
 const K=[['highlight','hlt','Highlight'],['underline','underline','Underline'],['circle','circle','Circle'],['note','note','Comment']];
 const simple=a.kind!=='above'&&a.kind!=='connect';const kk=K.find(k=>k[0]===a.kind);
 const tools=`<span class="tools2">${simple&&kk?`<button class="ek on" data-act="edpop" aria-label="Mark kind and color" title="${kk[2]}" style="color:${okHex(a.color)}">${ic(kk[1],16)}</button>`:''}<button class="edot" data-act="edpop" aria-label="Color" style="background:${okHex(a.color)}"></button><button class="emore" data-act="menu" data-m="card" data-id="${esc(a.id)}" aria-label="More">${ic('more',17)}</button></span>`;
 const pop=ui.edPop?`<div class="edpop">${simple?K.map(([k,i,l])=>`<button class="ek${a.kind===k?' on':''}" data-act="ekind" data-k="${k}" aria-label="${l}" title="${l}" style="color:${okHex(a.color)}">${ic(i,16)}</button>`).join('')+'<span class="edv"></span>':''}${PALETTE.map((c,i)=>`<button class="esw${String(a.color).toLowerCase()===c?' on':''}" style="background:${c}" data-act="ecol" data-c="${i}" aria-label="Color ${i+1}"></button>`).join('')}</div>`:'';
 const look=a.kind==='above'?`<label class="efld"><span>Words above</span><input id="eabove" value="${esc(a.above||'')}" autocomplete="off" autocapitalize="off" spellcheck="false"></label>`:a.kind==='connect'?`<div class="seg" style="margin:6px 0">${[['dotted','Dotted'],['dashed','Dashed'],['solid','Solid']].map(([v,l])=>`<button class="${((a.line||{}).style||'dotted')===v?'on':''}" data-act="eline" data-v="${v}">${l}</button>`).join('')}</div>`:'';
 const mine=a.tags||[];
 return `<div class="nc ed" data-m="${esc(a.id)}" style="--mc:${okHex(a.color)}"><div class="row1"><span class="nt" style="color:${col}">${tag?ic('pin',11):''}${esc(tag||KLABEL[a.kind]||'Note')}</span><em class="nq k-${KIND[a.kind]||'cm'}">${esc(words)}</em>${tools}</div>${pop}${look}
 <div class="enote" id="enote" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Note" data-ph="Write a note; type # for a tag">${a.note?md(a.note):''}</div>
 <div class="etags" id="etags">${mine.map(t=>tagChip(t,a,t===a.titleTag)).join('')}${ui.tagAdd?`<input id="etagin" placeholder="Tag" autocomplete="off" autocapitalize="off" spellcheck="false">`:`<button class="tgc add" data-act="tagadd">+ Tag</button>`}</div></div>`;
}
/* the # / + Tag suggestions */
function showTagSug(q,anchor){
 const st=tagStats(),a=findAnn(ui.edit);if(!a)return hideTagSug();const mine=a.tags||[];const qRaw=(q||'').trim();q=qRaw.toLowerCase();
 const list=Object.keys(st).concat(['Question','Observation','Interpretation','Application','Cross-reference']).filter((t,i,arr)=>arr.indexOf(t)===i&&!mine.includes(t)&&t.toLowerCase().startsWith(q)).sort((x,y)=>((st[y]||{}).n||0)-((st[x]||{}).n||0)).slice(0,6);
 const sg=$('#tsug');const r=anchor&&anchor.getBoundingClientRect?anchor.getBoundingClientRect():($('#enote')||document.body).getBoundingClientRect();
 sg.innerHTML=list.map((t,i)=>`<button class="${i===0?'on':''}" data-act="tagpick" data-t="${esc(t)}"><i style="background:${okHex(tagCol(t))}"></i>#${esc(t)}<small>${(st[t]||{}).n||''}</small></button>`).join('')+(q&&!list.some(t=>t.toLowerCase()===q)&&!mine.some(t=>t.toLowerCase()===q)?`<button data-act="tagpick" data-t="${esc(qRaw)}" data-new="1"><i style="background:#6c7891"></i>New tag “${esc(qRaw)}”</button>`:'');
 if(!sg.innerHTML){hideTagSug();return}
 sg.classList.add('show');sg.style.top=Math.min(r.bottom+6,innerHeight-sg.offsetHeight-10)+'px';sg.style.left=Math.max(8,Math.min(r.left,innerWidth-230))+'px';
}
function hideTagSug(){const sg=$('#tsug');if(sg){sg.classList.remove('show');sg.innerHTML=''}}
function hashBeforeCaret(){const s=getSelection();if(!s.rangeCount||!s.isCollapsed)return null;const n=s.anchorNode;if(!n||n.nodeType!==3||!n.parentElement.closest('#enote'))return null;const before=n.data.slice(0,s.anchorOffset);const m=before.match(/(^|\s)#([\p{L}\p{N}_-]*)$/u);return m?{node:n,start:s.anchorOffset-m[2].length-1,end:s.anchorOffset,q:m[2]}:null}
function addTag(t,fromHash){
 const st=cur(),a=findAnn(ui.edit);if(!a||!t)return;t=t.replace(/^#/,'').trim();if(!t)return;
 if(fromHash){const h=hashBeforeCaret();if(h){h.node.data=h.node.data.slice(0,h.start)+h.node.data.slice(h.end);const en=$('#enote');commit({op:'upd',sid:st.id,id:a.id,patch:{note:htmlToMd(en)}})}}
 if(!(a.tags||[]).includes(t))commit({op:'upd',sid:st.id,id:a.id,patch:{tags:[...(a.tags||[]),t]}});
 ui.tagAdd=false;hideTagSug();const et=$('#etags'),a2=findAnn(a.id);if(et&&a2)et.innerHTML=(a2.tags||[]).map(x=>tagChip(x,a2,x===a2.titleTag)).join('')+'<button class="tgc add" data-act="tagadd">+ Tag</button>'
}
/* B · I · U */
function placeBiu(){
 const b=$('#biu');if(!b)return;const s=getSelection();
 const host=s.rangeCount&&s.anchorNode&&(s.anchorNode.nodeType===1?s.anchorNode:s.anchorNode.parentElement);
 const box=host&&host.closest&&host.closest('#enote,#devnotes,#rpnotes');
 if(!box||s.isCollapsed){b.classList.remove('show');return}
 const r=s.getRangeAt(0).getBoundingClientRect();if(!r.width&&!r.height){b.classList.remove('show');return}
 const st=k=>{try{return document.queryCommandState(k)}catch(e){return false}};
 b.innerHTML=`<button data-act="fmtb" data-k="bold" class="${st('bold')?'on':''}" aria-label="Bold"><b>B</b></button><button data-act="fmtb" data-k="italic" class="${st('italic')?'on':''}" aria-label="Italic"><i>I</i></button><button data-act="fmtb" data-k="underline" class="${st('underline')?'on':''}" aria-label="Underline"><u>U</u></button>`;
 b.classList.add('show');const h=b.offsetHeight||38,w=b.offsetWidth||120;
 let top=r.bottom+10;if(top+h>innerHeight-10)top=r.top-h-56;b.style.top=Math.max(8,top)+'px';b.style.left=Math.max(8,Math.min(r.left+r.width/2-w/2,innerWidth-w-8))+'px';
}
document.addEventListener('selectionchange',()=>{clearTimeout(placeBiu.t);placeBiu.t=setTimeout(placeBiu,120)});
/* Manage tags */
function manageTags(){
 const st=tagStats(),rows=Object.entries(st).filter(([,v])=>v.n).sort((x,y)=>y[1].n-x[1].n);
 showSheetHtml(`<div style="display:flex;align-items:center;margin-bottom:6px"><b style="flex:1;font-size:15.5px">Tags</b><button class="quiet" data-act="sheetx">Done</button></div>${rows.length?rows.map(([t,v])=>`<div class="mtrow"><i style="background:${okHex(v.color||'#6c7891')}"></i><span class="mtn">#${esc(t)}<small>${v.n} note${v.n===1?'':'s'} · ${v.studies.size} stud${v.studies.size===1?'y':'ies'}</small></span><button class="quiet" data-act="mtrename" data-t="${esc(t)}">Rename</button><button class="quiet" data-act="mtcolor" data-t="${esc(t)}">Color</button><button class="quiet danger" data-act="mtdelete" data-t="${esc(t)}">Delete</button></div>${ui.mtColor===t?`<div class="mtsw">${PALETTE.map((c,i)=>`<button class="esw" style="background:${c}" data-act="mtsetcolor" data-t="${esc(t)}" data-c="${i}" aria-label="Color ${i+1}"></button>`).join('')}</div>`:''}`).join(''):'<p class="muted">No tags yet.</p>'}<p class="muted" style="font-size:12.5px;margin:10px 0 0">Rename a tag to another tag’s name to merge them. Changes reach every study.</p>`);
}
function forEachTagged(t,fn){studyList().forEach(s=>(s.annotations||[]).forEach(a=>{if((a.tags||[]).includes(t)||a.titleTag===t)fn(s,a)}))}

/* drag the line between the scripture and the notes */
(function(){let d=null;
 const at=x=>{const w=$('.studywrap');if(!w)return;const r=w.getBoundingClientRect();const pad=24;const max=Math.max(240,Math.min(r.width*0.72,r.width-pad*2-240)),min=200;const v=Math.round(Math.max(min,Math.min(max,r.right-pad-x)));w.style.setProperty('--ncol',v+'px');const t=$('#coldiv .wtip');if(t)t.textContent='Notes '+v+' px';d.v=v;posDiv()};
 document.addEventListener('pointerdown',e=>{const c=e.target.closest&&e.target.closest('#coldiv');if(!c)return;e.preventDefault();d={v:SET.ncol||null};c.classList.add('drag');try{c.setPointerCapture(e.pointerId)}catch(x){}});
 document.addEventListener('pointermove',e=>{if(!d)return;e.preventDefault();at(e.clientX)});
 document.addEventListener('pointerup',()=>{if(!d)return;const c=$('#coldiv');if(c)c.classList.remove('drag');if(d.v){SET.ncol=d.v;saveSet()}d=null;if(ui.bar)placeBar()});
 document.addEventListener('dblclick',e=>{if(e.target.closest&&e.target.closest('#coldiv')){delete SET.ncol;saveSet();lastKey='';render()}});
})();
function posDiv(){const c=$('#coldiv'),w=$('.studywrap');if(!c||!w)return;const row=w.querySelector('.vrow .cards');if(!row){c.style.display='none';return}c.style.display='';const wr=w.getBoundingClientRect(),cr=row.getBoundingClientRect();c.style.left=(cr.left-wr.left-11)+'px';const hr=w.querySelector('.hrow');c.style.top=(hr?hr.offsetTop+hr.offsetHeight:0)+'px'}
/* About this screen (Settings): what the iPad tells the app about the window */
function screenInfo(){fitApp();const pr=document.createElement('div');pr.style.cssText='position:fixed;left:0;top:0;width:1px;height:100lvh;padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px);visibility:hidden;pointer-events:none';document.body.appendChild(pr);const cs=getComputedStyle(pr);const out={window:`${innerWidth}×${innerHeight}`,visible:window.visualViewport?`${Math.round(visualViewport.width)}×${Math.round(visualViewport.height)}`:'–',screen:`${screen.width}×${screen.height}`,page:`${document.documentElement.clientWidth}×${document.documentElement.clientHeight}`,large:Math.round(pr.getBoundingClientRect().height-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom))+' high',top:cs.paddingTop,bottom:cs.paddingBottom,app:Math.round($('#app').getBoundingClientRect().height)+' high',fix:ui.fitNote||'none needed',standalone:String(!!(navigator.standalone||matchMedia('(display-mode: standalone)').matches))};pr.remove();return out}
/* if the iPad's large viewport is taller than the window the app was given, use it */
function fitApp(){
 /* The installed iPad app runs under the clock (black-translucent), but iPadOS sizes its page as if it didn't:
    window 922 high on a 954-high screen, starting at the top, so a strip the height of the clock was left empty at the bottom.
    Give the app the full screen height when the missing part matches the clock's space. */
 const a=$('#app');if(!a)return;const sa=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
 const pr=document.createElement('div');pr.style.cssText='position:fixed;top:0;height:0;padding-top:env(safe-area-inset-top,0px);visibility:hidden';document.body.appendChild(pr);const top=parseFloat(getComputedStyle(pr).paddingTop)||0;pr.remove();
 const landscape=innerWidth>innerHeight,sh=landscape?Math.min(screen.width,screen.height):Math.max(screen.width,screen.height);
 const gap=sh-innerHeight;
 if(sa&&top>0&&gap>4&&Math.abs(gap-top)<=4){a.style.bottom='auto';a.style.height=sh+'px';ui.fitNote=`filled the ${Math.round(gap)} px left under the app`}
 else{a.style.bottom='';a.style.height='';ui.fitNote=''}
}
addEventListener('resize',()=>{fitApp();posDiv()});addEventListener('orientationchange',()=>setTimeout(fitApp,300));[50,600,1500,4000].forEach(t=>setTimeout(fitApp,t));/* ===================== 1.5: new studies, Study notes editing, the Bible view, notes as dots ===================== */
ICO['mg-new']='<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-linecap="round"/>';IC_ALIAS.plusI='mg-new';
/* ---------- new study ---------- */
function seriesList(){return [...new Set(studyList().map(s=>s.series).filter(Boolean).filter(x=>x!=='Devotional'))].sort()}
function newStudyForm(pre={}){
 const trs=Object.keys(TRS).filter(k=>trAvail(k));const deftr=pre.tr||LS.get('lastTr',trs[0]||'kjv');
 showSheetHtml(`<div class="nsf"><div style="display:flex;align-items:center;margin-bottom:8px"><b style="flex:1;font-size:16px">New study</b><button class="quiet" data-act="sheetx">Cancel</button></div>
 <label class="efld"><span>Passage</span><input id="nsref" value="${esc(pre.ref||'')}" placeholder="e.g. John 3:1–21 or Romans 8" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="next"></label>
 <label class="efld"><span>Title</span><input id="nstitle" value="${esc(pre.title||'')}" placeholder="The passage, if left empty" autocomplete="off" enterkeyhint="next"></label>
 <label class="efld"><span>Series</span><input id="nsseries" list="nsserieslist" value="${esc(pre.series||'')}" placeholder="Optional" autocomplete="off" enterkeyhint="done"><datalist id="nsserieslist">${seriesList().map(s=>`<option value="${esc(s)}">`).join('')}</datalist></label>
 <div class="lbl" style="margin-top:4px">Translation</div><div class="seg nstr" style="flex-wrap:wrap">${trs.map(k=>`<button class="${k===deftr?'on':''}" data-act="nstr" data-tr="${k}">${esc(trName(k))}</button>`).join('')}</div>
 <p class="muted nserr" id="nserr" style="min-height:1.2em;margin:6px 0"></p><button class="btn" data-act="nscreate" style="width:100%">Create study</button></div>`);
 setTimeout(()=>{const i=$('#nsref');if(i&&!pre.ref)i.focus()},60);
}
const trAvail=k=>trAvailable(k);
async function createStudy(){
 const r=parseRef(($('#nsref')||{}).value);const err=$('#nserr');
 if(!r){if(err)err.textContent='Type a passage like John 3:1–21 or Romans 8.';return}
 const ref=await settleRef(r);const tr=($('.nstr button.on')||{}).dataset?$('.nstr button.on').dataset.tr:'kjv';
 const title=(($('#nstitle')||{}).value||'').trim()||refStr(ref),series=(($('#nsseries')||{}).value||'').trim();
 const id='st_'+rid(),now=new Date().toISOString();
 const d={id,title,series,createdAt:now,updatedAt:now,translations:[tr],layout:'margin',passages:[{id:'p_'+rid(),ref}],annotations:[],outline:'### Observe\n\n### Interpret\n\n### Apply\n',summary:'',headings:[],labels:[],boxes:[],v18:1,tagColors:{},v19:1};
 S.studies[id]={d,itemId:null,eTag:null};S.pending.push({op:'new',sid:id,d:JSON.parse(JSON.stringify(d))});
 savePending();saveStudies();clearTimeout(syncT);syncT=setTimeout(()=>sync(),1200);LS.set('lastTr',tr);
 closeSheet();ui.sid=id;ui.view='study';ui.sideOver=false;ui.sideTab=null;lastKey='';render();toast('Study created');
}
/* ---------- Study notes edited in the right panel ---------- */
function rpNotesHtml(st){return `<div class="outline rpo rpedit" id="rpnotes" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Study notes" data-ph="Write your Study notes">${st.outline&&st.outline.trim()?md(st.outline):''}</div>`}
/* resize the right panel: drag its edge (iPad) or its grab bar (phone sheet) */
(function(){let d=null;
 document.addEventListener('pointerdown',e=>{const h=e.target.closest&&e.target.closest('.rpgrip');if(!h)return;e.preventDefault();const p=$('#rpanel');const r=p.getBoundingClientRect();d={sheet:h.classList.contains('sheet'),x:e.clientX,y:e.clientY,w:r.width,h:r.height};h.classList.add('drag')});
 document.addEventListener('pointermove',e=>{if(!d)return;e.preventDefault();const p=$('#rpanel');if(d.sheet){const v=Math.max(innerHeight*.3,Math.min(innerHeight*.92,d.h-(e.clientY-d.y)));p.style.height=v+'px';d.v=v/innerHeight}else{const v=Math.max(240,Math.min(Math.min(600,innerWidth*.55),d.w-(e.clientX-d.x)));p.style.width=v+'px';d.v=v}});
 document.addEventListener('pointerup',()=>{if(!d)return;const g=$('.rpgrip.drag');if(g)g.classList.remove('drag');if(d.v){if(d.sheet)SET.rpH=d.v;else SET.rpW=Math.round(d.v);saveSet()}d=null});
})();
function applyRpSize(){const p=$('#rpanel');if(!p)return;const sheet=!MID.matches&&ui.rpOver;p.style.width=!sheet&&SET.rpW?SET.rpW+'px':'';p.style.height=sheet&&SET.rpH?Math.round(SET.rpH*innerHeight)+'px':''}
/* ---------- the Bible view ---------- */
function bibleRef(){if(!ui.bib)ui.bib=LS.get('bibAt',{b:42,c:1});return ui.bib}
function bibleTr(){return ui.bibToday&&ui.bibToday.tr&&ui.view==='bible'?ui.bibToday.tr:LS.get('bibTr',LS.get('lastTr','kjv'))}
function versesInStudies(b,c){const m={};studyList().forEach(s=>{if(s.kind==='devotional')return;(s.passages||[]).forEach(p=>{const r=p.ref;if(!r||r.b!==b)return;for(let ch=r.c1;ch<=r.c2;ch++){if(ch!==c)continue;const a=ch===r.c1?r.v1:1,z=ch===r.c2?r.v2:999;for(let v=a;v<=z;v++){(m[v]=m[v]||[]).push({sid:s.id,pid:p.id,title:s.title})}}})});return m}
function bookPicker(){
 const {b}=bibleRef();const sel=ui.bpickB!=null?ui.bpickB:null;
 if(sel==null)return `<div class="bpk">${[['Old Testament',0,39],['New Testament',39,66]].map(([l,a,z])=>`<div class="gl" style="margin:8px 2px 6px">${l}</div><div class="bgrid">${BOOKS.slice(a,z).map((n,i)=>`<button class="${a+i===b?'on':''}" data-act="bbook" data-b="${a+i}">${esc(bname(a+i,true))}</button>`).join('')}</div>`).join('')}</div>`;
 return `<div class="bpk"><div style="display:flex;align-items:center;gap:8px;margin:4px 2px 8px"><button class="quiet" data-act="bbook" data-b="-1">${ic('chevL',14)} Books</button><b>${esc(bname(sel))}</b></div><div class="cgrid">${Array.from({length:CHAPS[sel]},(_,i)=>`<button data-act="bgo" data-b="${sel}" data-c="${i+1}">${i+1}</button>`).join('')}</div></div>`;
}
/* ---------- notes as dots ---------- */
if(!ui.dotOpen)ui.dotOpen=new Set();
/* ===================== 1.6: home, the Bible, Focus in one place, overall thoughts, share ===================== */
Object.assign(ICO,{
 'mg-home':'<path d="M4 11l8-7 8 7v9H4z" stroke="currentColor" stroke-linejoin="round"/><path d="M10 20v-6h4v6" stroke="currentColor" stroke-linejoin="round"/>',
 'mg-bible':'<path d="M5 3h12a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2z" stroke="currentColor" stroke-linejoin="round"/><path d="M12 7v7M9.5 9.5h5" stroke="currentColor" stroke-linecap="round"/>',
 'mg-pen':'<path d="M14.4 5.6l4 4M4 20l1-4L16 5l3 3L8 19z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
 'mg-share':'<path d="M12 3v12M8 7l4-4 4 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" stroke="currentColor" stroke-linecap="round"/>'
});
Object.assign(IC_ALIAS,{homeI:'mg-home',bibleI:'mg-bible',pen:'mg-pen',shareI:'mg-share'});

/* ---------- recent places (home view) ---------- */
function pushRecent(it){const bk=it.k==='bible'?String(it.id).split(':')[0]+':':null;const r=LS.get('recent',[]).filter(x=>!(x.k===it.k&&(x.id===it.id||(bk&&String(x.id).startsWith(bk)))));r.unshift(Object.assign({at:Date.now()},it));LS.set('recent',r.slice(0,12))}
function whenStr(t){const d=new Date(t),n=new Date();const day=Math.round((new Date(n.getFullYear(),n.getMonth(),n.getDate())-new Date(d.getFullYear(),d.getMonth(),d.getDate()))/864e5);return day<=0?'Today':day===1?'Yesterday':d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}
function vHome(){
 const t=new Date(),tk=dkey(t),today=devFor(tk);
 let dc;
 if(today&&today.dev.done)dc=`<div class="hday hdone"><div class="l">Today’s reading · done</div><div class="t">${esc(today.title)}</div><div class="m">You wrote ${(today.annotations||[]).filter(a=>a.kind==='note').length+(devBody(today.outline)?1:0)} notes</div><div class="row"><button class="go" data-act="devopen" data-s="${esc(today.id)}">See my notes</button></div></div>`;
 else if(today&&devTouched(today))dc=`<div class="hday"><div class="l">Today’s reading</div><div class="t">${esc(today.title)}</div><div class="m">Started ${partOfDay(new Date(today.createdAt||Date.now()))}</div><div class="row"><button class="go" data-act="devopen" data-s="${esc(today.id)}">Continue</button></div></div>`;
 else{const r=today?devRef(today):devProposal(tk);dc=`<div class="hday"><div class="l">Today’s reading</div><div class="t">${esc(today?today.title:(r?devTitle(r):'…'))}</div><div class="m">${r?(r.v2-r.v1+1)+' verses · about '+Math.max(1,Math.round((r.v2-r.v1+1)*25/200))+' minutes':''}</div><div class="row"><button class="go" ${today?`data-act="devopen" data-s="${esc(today.id)}"`:'data-act="start"'}>Begin</button><button class="ql2" data-act="nav" data-v="devo">Another day</button></div></div>`}
 const ls=LS.get('lastStudy',null),st=ls&&S.studies[ls]&&S.studies[ls].d;
 const cc=st?`<button class="hcont" data-act="open" data-s="${esc(st.id)}"><span class="bar3"></span><span class="tx"><b>${esc(st.title||'Untitled')}</b><small>${esc((st.passages||[]).map(p=>refStr(p.ref)).join(', '))}${st.series?' · '+esc(st.series):''}</small></span><span class="ar">Continue</span></button>`:`<button class="hcont" data-act="newstudy"><span class="bar3"></span><span class="tx"><b>Start your first study</b><small>Pick a passage and start marking</small></span><span class="ar">New study</span></button>`;
 const ba=LS.get('bibAt',null);const bc=ba&&ba.v?`<button class="hcont" data-act="bcontinue"><span class="bar3 g"></span><span class="tx"><b>Continue reading · ${esc(bname(ba.b,true))} ${ba.c}</b><small>${esc(trName(bibleTr()))} · verse ${ba.v}${ba.n?' of '+ba.n:''} · ${whenStr(ba.at||Date.now())}</small>${ba.n?`<span class="prog"><i style="width:${Math.round(100*ba.v/ba.n)}%"></i></span>`:''}</span><span class="ar">Open</span></button>`:'';
 const rec=LS.get('recent',[]).filter(r=>r.k!=='study'||S.studies[r.id]).slice(0,8);
 const K={study:'Study',bible:'Bible',devo:'Devotional'};
 const body=`<div class="home"><div class="hgreetrow"><button class="ib sideb" data-act="sidebtn" aria-label="Sidebar" title="Sidebar">${ic('side',18)}</button><div class="hgreet">${greeting()}</div></div><div class="hdate">${t.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</div>
 <div class="htwo">${dc}<div class="hconts">${cc}${bc}</div></div>
 <div class="hdoors"><button data-act="newstudy">${ic('plusI',20)}New study</button><button data-act="nav" data-v="bible">${ic('bibleI',20)}Bible</button><button data-act="nav" data-v="search">${ic('search',20)}Search</button><button data-act="nav" data-v="devo">${ic('cal',20)}Devotional</button></div>
 ${rec.length?`<div class="hgl">Recent</div><div class="hrec">${rec.map(r=>`<button data-act="hrec" data-k="${r.k}" data-id="${esc(r.id)}"><span class="k">${K[r.k]||''}</span><span class="tt">${esc(r.t)}</span><small>${whenStr(r.at)}</small></button>`).join('')}</div>`:''}</div>`;
 return {bar:'',body};
}

/* ---------- the Bible: the designed book list ---------- */
const BGROUPS=[['ot','Law',0,5],['ot','History',5,17],['ot','Poetry',17,22],['ot','Prophets',22,39],['nt','Gospels',39,43],['nt','History',43,44],['nt','Paul’s letters',44,57],['nt','Other letters',57,65],['nt','Prophecy',65,66]];
function booksMarked(){const s=new Set(Object.keys(LS.get('bibRead',{})).map(Number));studyList().forEach(st=>(st.passages||[]).forEach(p=>p.ref&&s.add(p.ref.b)));return s}
function vBibleList(){
 const at=bibleRef(),read=LS.get('bibRead',{}),marked=booksMarked();const test=ui.bibTest||(at.b>=39?'nt':'ot');const open=ui.bpickB;
 const groups=BGROUPS.filter(g=>g[0]===test).map(([,l,a,z])=>`<div class="blk"><div class="grp2">${l}</div>${Array.from({length:z-a},(_,i)=>a+i).map(b=>`<button class="bk2${open===b?' on':''}" data-act="bbook" data-b="${open===b?-1:b}">${marked.has(b)&&open!==b?'<span class="bkdot"></span>':''}${esc(BOOKS[b])}</button>${open===b?`<div class="chrow">${Array.from({length:CHAPS[b]},(_,i)=>i+1).map(c=>`<button class="${b===at.b&&c===at.c?'on':''}" data-act="bgo" data-b="${b}" data-c="${c}">${c}</button>`).join('')}</div>`:''}`).join('')}</div>`).join('');
 const bar=`<span class="ibn">${ic('search',17)}</span><input id="bq" class="bq" placeholder="Type a passage, or pick a book" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go"><span id="bqhint" class="bqh"></span><button class="quiet" data-act="blistx">Cancel</button>`;
 const body=`<div class="pl2"><div class="tabs2"><button class="${test==='ot'?'on':''}" data-act="btest" data-t="ot">Old Testament</button><button class="${test==='nt'?'on':''}" data-act="btest" data-t="nt">New Testament</button></div><div class="cols2">${groups}</div></div>`;
 return {bar,body};
}
/* marks from your studies, softly, on the Bible text */
function bibleMarks(b,c,tr){const out={};studyList().forEach(s=>{if(s.kind==='devotional')return;(s.annotations||[]).forEach(a=>{if(!['highlight','underline','circle','note'].includes(a.kind))return;(a.spans||[]).forEach(sp=>{if(sp.tr!==tr||sp.b!==b||sp.c!==c)return;(out[sp.v]=out[sp.v]||[]).push({s:sp.s,e:sp.e,a,sid:s.id})})})});return out}
function markedVerse(t,ms){if(!ms||!ms.length)return esc(t);ms=ms.slice().sort((x,y)=>x.s-y.s);let h='',pos=0;ms.forEach(m=>{if(m.s<pos)return;h+=esc(t.slice(pos,m.s))+`<span class="bm bm-${KIND[m.a.kind]||'cm'}" style="--mc:${okHex(m.a.color)}" data-act="bmark" data-sid="${esc(m.sid)}" data-m="${esc(m.a.id)}">${esc(t.slice(m.s,m.e))}</span>`;pos=m.e});return h+esc(t.slice(pos))}
function vBible(){
 if(ui.bibList)return vBibleList();
 const {b,c}=bibleRef(),tr=bibleTr(),ch=chapter(tr,b,c),ins=versesInStudies(b,c),mk=bibleMarks(b,c,tr),today=ui.bibToday&&ui.bibToday.b===b&&ui.bibToday.c===c?ui.bibToday:null;
 const page=bibPageGet();
 const head=`<div class="hrow bhead"><div class="hl"><button class="hm strong refb" data-act="bpick">${esc(bname(b,true))} ${c} ▾</button><button class="hm" data-act="menu" data-m="btr">${esc(trName(tr))} ▾</button></div><div class="hr"><span class="sp"></span><button class="hq" data-act="bstep" data-d="-1" aria-label="Previous chapter">${ic('chevL',16)}</button><button class="hq" data-act="bstep" data-d="1" aria-label="Next chapter">${ic('chevR',16)}</button></div></div>`;
 let rows='';
 if(!ch)rows=`<p class="muted" style="padding:20px 24px">${CHERR[chKey(tr,b,c)]?'Couldn’t load this chapter. <button class="quiet" data-act="bretry">Try again</button>':'Loading…'}</p>`;
 else{const para=curLayout()==='para';const vt=(t,v)=>{const tv=today&&v>=today.v1&&v<=today.v2;return `<span class="vn" id="bv-${v}">${v}</span>${ins[v]?`<button class="bdot" data-act="bstudy" data-v="${v}" aria-label="In ${ins[v].length} stud${ins[v].length===1?'y':'ies'}"></button>`:''}<span class="vtx${tv?' today-v':''}" data-p="bible" data-b="${b}" data-c="${c}" data-v="${v}">${markedVerse(t,mk[v])}</span> `};
  if(para){let h='<p class="vt">';ch.v.forEach((t,i)=>{const v=i+1;if(ch.p&&ch.p.includes(v)&&v>1)h+='</p><p class="vt">';h+=vt(t,v)});rows=`<div class="btext para">${h}</p></div>`}
  else rows=`<div class="btext">${ch.v.map((t,i)=>`<p class="vt">${vt(t,i+1)}</p>`).join('')}</div>`}
 const prevB=c>1?[b,c-1]:b>0?[b-1,CHAPS[b-1]]:null,nextB=c<CHAPS[b]?[b,c+1]:b<65?[b+1,1]:null;
 const foot=ch?`<div class="nextch">${prevB?`<button class="pv" data-act="bstep" data-d="-1">← ${esc(bname(prevB[0],true))} ${prevB[1]}</button>`:'<span></span>'}${nextB?`<button data-act="bstep" data-d="1">${esc(bname(nextB[0],true))} ${nextB[1]} →</button>`:''}</div>`:'';
 const back=today?`<button class="bback" data-act="devback">← Back to today’s reading</button>`:'';
 const body=`${banners()}<div class="studywrap bible page-${page}">${back}<div class="shd"><div class="ser">${today?'From today’s reading':'Bible'}</div><div class="ttl">${esc(bname(b))} ${c}</div><div class="ref">${esc(trName(tr))}</div></div>${head}${rows}${foot}<div style="height:120px"></div></div>`;
 return {bar:topbar(WIDE.matches?'':`${esc(bname(b,true))} ${c}`,{focus:1,extra:`<button class="ib aaib" data-act="txt" aria-label="Reading settings">Aa</button>`}),body};
}
/* remember where you are; mark chapters read */
let bibSaveT=0;
let bibIdleT=0,bibLastTop=0,bibDir=0,bibDwell=null;
function bibTrack(){
 if(ui.view!=='bible'||ui.bibList)return;const bd=$('#body');if(!bd)return;const top=bd.getBoundingClientRect().top+70;
 bibDir=bd.scrollTop>bibLastTop?1:bd.scrollTop<bibLastTop?-1:bibDir;bibLastTop=bd.scrollTop;
 const secs=[...document.querySelectorAll('.bch')];if(!secs.length)return;
 let cur=secs[0];for(const s of secs){if(s.getBoundingClientRect().top<=top)cur=s;else break}
 const b=+cur.dataset.b,c=+cur.dataset.c;
 if(!ui.bib||ui.bib.b!==b||ui.bib.c!==c){ui.bib={b,c};document.querySelectorAll('.bcur, #fx .txtp[data-act=bpick]').forEach(el=>{el.textContent=el.classList.contains('slimref')||(el.closest('#fx'))?`${bname(b,true)} ${c} ▾`:`${bname(b)} ${c}`});document.querySelectorAll('#side .sbl .chrow button.on').forEach(x=>x.classList.remove('on'));const sbb=document.querySelector(`#side .sbl [data-act=sbgo][data-b="${b}"][data-c="${c}"]`);if(sbb)sbb.classList.add('on');bibDwell={b,c,at:Date.now()}}
 const vs=[...cur.querySelectorAll('.vn')];let v=1;for(const el of vs){if(el.getBoundingClientRect().top<=top)v=+el.textContent;else break}
 clearTimeout(bibSaveT);bibSaveT=setTimeout(()=>{LS.set('bibAt',{b,c,v,n:vs.length,at:Date.now()});const end=cur.getBoundingClientRect().bottom<=bd.getBoundingClientRect().bottom+40;if(end){const rd=LS.get('bibRead',{});rd[b]=[...new Set([...(rd[b]||[]),c])];LS.set('bibRead',rd)}if(end||(bibDwell&&bibDwell.b===b&&bibDwell.c===c&&Date.now()-bibDwell.at>20000))pushRecent({k:'bible',id:b+':'+c,t:`${bname(b,true)} ${c}`})},300);
 bibTrack2();
}
/* swipe between chapters */
(function(){let s=null;
 document.addEventListener('touchstart',e=>{if(ui.view!=='bible'||ui.bibList||e.touches.length!==1||ui.selDrag)return;const t=e.touches[0];s={x:t.clientX,y:t.clientY,at:Date.now()}},{passive:true});
 document.addEventListener('touchend',e=>{if(!s)return;const t=e.changedTouches[0],dx=t.clientX-s.x,dy=t.clientY-s.y;const ok=Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.8&&Date.now()-s.at<700&&!ui.selDrag;s=null;if(ok)A.bstep({dataset:{d:dx<0?'1':'-1'}})},{passive:true});
})();

/* ---------- Focus: leave from the same top-right spot ---------- */
function fxHtml(){return focusOn()?`<button class="fxbtn" data-act="focus" aria-label="Leave Focus" title="Leave Focus">${ic('unfocus',17)}</button>`:''}

/* ---------- devotional: overall thoughts as a quiet pen pill ---------- */
function otFirstLine(st){const lines=String(st.outline||'').split('\n').filter(l=>l.trim()&&!/^#{1,6}\s/.test(l));return lines.length?plainMd(lines[0]).slice(0,80):''}
function otHtml(st,tmpl){
 if(ui.otOpen)return `<div class="otpane" id="otpane"><div class="othd"><span class="dlab">Overall thoughts</span><button class="tpill" data-act="menu" data-m="dtpl">${esc((DTPL[tmpl]||DTPL.inductive).n)} ▾</button><button class="otx" data-act="otclose">Close</button></div><div class="devnotes" id="devnotes" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Overall thoughts">${devNotesHtml(st.outline)}</div><span class="otsv">Saved as you write</span></div>`;
 const fl=otFirstLine(st);
 return `<button class="otpill${fl?' has':''}" data-act="otopen" aria-label="Overall thoughts" title="Overall thoughts">${ic('pen',15)}${fl?`<span class="otl">Overall thoughts</span><span class="otp">${esc(fl)}${fl.length>=80?'…':''}</span>`:''}</button>`;
}

/* ---------- share a devotional reading ---------- */
const SH_STYLES=[['paper','Paper'],['plain','Plain'],['dark','Dark'],['sunset','Sunset']];
const SH_SOLIDS=['#e9e3d6','#dfe6dc','#dde4ec','#ece0e3','#e4e0ec','#e8e4d2','#d6e3e6','#2f3542','#3a3834','#2e3a33'];
const SH_SIZES={square:[1080,1080,40],portrait:[1080,1350,46],story:[1080,1920,50]};
function shTokens(style){
 const T={paper:{bg:'#fbf8f2',glow:'rgba(255,206,140,.40)',ink:'#24324b',lab:'#a88d63',num:'#5b8afe',hl:'rgba(255,214,102,.45)',ul:'#5b8afe',rule:'#d9c9a8'},plain:{bg:'#ffffff',ink:'#24324b',lab:'#8a93a6',num:'#5b8afe',hl:'rgba(91,138,254,.16)',ul:'#5b8afe',rule:'#d5dae3'},dark:{bg:'#1d1c1a',glow:'rgba(255,184,100,.12)',ink:'#eceef2',lab:'#9c8660',num:'#8fb0ff',hl:'rgba(255,200,90,.22)',ul:'#8fb0ff',rule:'#4a4234',dark:1},sunset:{bg:'#f7eff3',sunset:1,ink:'#2b2f45',lab:'#a5807a',num:'#c0705a',hl:'rgba(255,170,120,.35)',ul:'#c0705a',rule:'#e3c3b8'}};
 if(T[style])return T[style];
 const c=style.replace('solid:','');const n=parseInt(c.slice(1),16),l=(0.299*(n>>16)+0.587*(n>>8&255)+0.114*(n&255))/255;const dark=l<.5;
 return {bg:c,ink:dark?'#eef0f3':'#26303f',lab:dark?'#b8b2a5':'#857b69',num:dark?'#a9c1f6':'#4a6fc9',hl:dark?'rgba(255,214,120,.24)':'rgba(255,255,255,.55)',ul:dark?'#a9c1f6':'#4a6fc9',rule:dark?'rgba(255,255,255,.22)':'rgba(0,0,0,.14)',dark:dark?1:0};
}
function shVerseList(st){const r=devRef(st),tr=studyTr(st),out=[];if(!r)return out;const c2=r.c2||r.c1;for(let c=r.c1;c<=c2;c++){const ch=chapter(tr,r.b,c);const n=ch?ch.v.length:(c===c2&&r.v2<999?r.v2:0);const a=c===r.c1?r.v1:1,z=c===c2?Math.min(r.v2,n||r.v2):n;for(let v=a;v<=z&&v<=(n||z);v++)out.push({c,v})}return out}
function shStart(){
 const st=ui.view==='devmode'?(S.studies[ui.devSid]&&S.studies[ui.devSid].d):cur();if(!st||st.kind!=='devotional')return;const r=devRef(st);if(!r)return;const tr=studyTr(st);
 const L=shVerseList(st);if(!L.length){toast('The reading is still loading; try Share again in a moment');return}
 const idx=(c,v)=>L.findIndex(x=>x.c===c&&x.v===v);const marked=(st.annotations||[]).filter(a=>['highlight','underline','circle'].includes(a.kind)).flatMap(a=>(a.spans||[]).filter(s=>s.tr===tr).map(s=>idx(s.c,s.v))).filter(i=>i>=0);
 const v1=marked.length?Math.min(...marked):0,v2=marked.length?Math.max(...marked):L.length-1;
 const p=LS.get('share',{});
 ui.sh={sid:st.id,v1,v2,size:p.size||'portrait',style:p.style||'paper',beside:!!p.beside,marks:true,notes:new Set(),take:!!devBody(st.outline),takeFrom:null,takeText:'',name:p.name!==false,badge:p.badge!==false,page:'main'};
 ui.sh.takeText=shTakeDefault(st);
 renderShare();
}
function shSections(st){const out=[];let cur=null;String(st.outline||'').split('\n').forEach(l=>{const m=l.match(/^#{1,6}\s+(.*)/);if(m){cur={h:m[1].trim(),t:[]};out.push(cur)}else if(l.trim()){if(!cur){cur={h:'Notes',t:[]};out.push(cur)}cur.t.push(plainMd(l))}});return out.filter(s=>s.t.length)}
function shTakeDefault(st){const ss=shSections(st);if(!ss.length)return '';const s=ui.sh&&ui.sh.takeFrom?ss.find(x=>x.h===ui.sh.takeFrom)||ss[ss.length-1]:ss[ss.length-1];if(ui.sh)ui.sh.takeFrom=s.h;return s.t.join(' ').slice(0,180)}
function shData(){
 const sh=ui.sh;if(!sh)return null;const st=S.studies[sh.sid]&&S.studies[sh.sid].d;if(!st)return null;const r=devRef(st),tr=studyTr(st);
 const L=shVerseList(st);if(!L.length)return null;const i1=Math.max(0,Math.min(sh.v1,L.length-1)),i2=Math.max(i1,Math.min(sh.v2,L.length-1));const pick=L.slice(i1,i2+1);
 if(pick.some(x=>!chapter(tr,r.b,x.c)))return null;
 const verses=pick.map(({c,v})=>{const t=(chapter(tr,r.b,c).v[v-1])||'';const marks=sh.marks?(st.annotations||[]).filter(a=>['highlight','underline','circle'].includes(a.kind)).flatMap(a=>(a.spans||[]).filter(s=>s.tr===tr&&s.c===c&&s.v===v).map(s=>({s:s.s,e:s.e,k:a.kind,c:okHex(a.color)}))):[];return {v,c,t,marks}});
 const inPick=(c,v)=>pick.some(x=>x.c===c&&x.v===v);
 const notes=(st.annotations||[]).filter(a=>a.kind==='note'&&a.note&&sh.notes.has(a.id)).map(a=>{const sp=(a.spans||[{}])[0];return {v:sp.v,c:sp.c,t:plainMd(a.note)}}).filter(n=>inPick(n.c,n.v)).sort((x,y)=>(x.c-y.c)||(x.v-y.v));
 const f=pick[0],l=pick[pick.length-1];const ref=`${bname(r.b,true)} ${f.c}:${f.v}${l.c!==f.c?'–'+l.c+':'+l.v:l.v!==f.v?'–'+l.v:''}`;
 const trl=(TRS[tr]&&TRS[tr].copy)?TRS[tr].copy:tr==='web'?'World English Bible (public domain)':tr==='kjv'?'King James Version (public domain)':trName(tr);
 return {ref,verses,notes,take:sh.take&&sh.takeText?sh.takeText:'',name:sh.name?(SET.shareName||''):'',badge:sh.badge,trl,copyLocked:!!(TRS[tr]&&TRS[tr].copy),tr};
}
function shText(){const d=shData();if(!d)return '';let s=`${d.ref} (${trName(d.tr)})\n“${d.verses.map(v=>v.t.trim()).join(' ')}”\n`;if(d.notes.length)s+='\n'+d.notes.map(n=>`v${n.v}: ${n.t}`).join('\n')+'\n';if(d.take)s+=`\n“${d.take}”\n`;if(d.name)s+=`— ${d.name}\n`;s+=`\n${d.trl}\n`;if(d.badge)s+='Shared from Marginalia\n';return s}
/* draw the card */
let shLogo=null;
function wrapWords(ctx,tokens,maxW){const lines=[];let line=[],w=0;tokens.forEach(tk=>{const tw=ctx.measureText(tk.t).width;if(w+tw>maxW&&line.length&&tk.t.trim()){lines.push(line);line=[];w=0;if(!tk.t.trim())return}line.push(Object.assign({},tk,{w:tw}));w+=tw});if(line.length)lines.push(line);return lines}
function shLayout(ctx,d,W,H,base,tok,dry){
 const pad=H>=1900?96:86,fs=base,serif='"Source Serif 4", Georgia, serif',ui2='Figtree, system-ui, sans-serif';
 const ops=[];let y=0;const colW=ui.sh.beside&&d.notes.length?Math.round((W-pad*2)*0.6):W-pad*2;
 const push=o=>ops.push(o);
 ctx.font=`600 ${Math.round(fs*0.42)}px ${ui2}`;push({k:'lab',y:y+fs*0.42,t:d.ref.toUpperCase()});y+=fs*0.42+fs*0.55;push({k:'sprig',y});y+=fs*0.9;
 const vy0=y;ctx.font=`${fs}px ${serif}`;
 const tokens=[];d.verses.forEach(v=>{tokens.push({t:v.v+' ',num:1,v:v.v,c:v.c});const words=v.t.split(/(\s+)/);let pos=0;words.forEach(w=>{const s=pos,e=pos+w.length;pos=e;if(!w)return;const m=v.marks.find(m=>s<m.e&&e>m.s);tokens.push({t:w,hl:m&&m.k!=='underline',ul:m&&m.k==='underline',mc:m&&m.c})});tokens.push({t:' '})});
 const lines=wrapWords(ctx,tokens.map(tk=>tk.num?Object.assign({},tk):tk),colW);
 const vyl={};lines.forEach(l=>{l.forEach(t=>{if(t.num&&vyl[t.c+':'+t.v]==null)vyl[t.c+':'+t.v]=y});push({k:'line',y:y+fs,l});y+=fs*1.55});
 let vy=y;
 if(d.notes.length){ctx.font=`italic ${Math.round(fs*0.74)}px ${serif}`;let ny=ui.sh.beside?vy0:y+fs*0.4;const nx=ui.sh.beside?colW+fs*1.2:0,nw=ui.sh.beside?W-pad*2-colW-fs*1.2:W-pad*2;
  d.notes.forEach(n=>{if(ui.sh.beside){const at=vyl[n.c+':'+n.v];if(at!=null)ny=Math.max(ny,at)}const nl=wrapWords(ctx,(`v${n.v}  `+n.t).split(/(\s+)/).filter(Boolean).map(t=>({t})),nw-fs*0.6);push({k:'note',x:nx,y:ny,lines:nl,h:nl.length*fs*0.74*1.45});ny+=nl.length*fs*0.74*1.45+fs*0.5});
  y=Math.max(y,ny)}
 if(d.take){y+=fs*0.3;push({k:'sprig',y});y+=fs*0.9;ctx.font=`italic ${Math.round(fs*0.98)}px ${serif}`;const tl=wrapWords(ctx,('“'+d.take+'”').split(/(\s+)/).filter(Boolean).map(t=>({t})),W-pad*2-fs);tl.forEach(l=>{push({k:'take',y:y+fs*0.98,l});y+=fs*0.98*1.4})}
 const footH=fs*1.3;const avail=H-pad*2-footH-fs*0.6;
 return {ops,h:y,fits:y<=avail,pad,fs,serif,ui2,colW,top:pad+Math.max(0,(avail-y)/2)};
}
function shTint(hex,a){const n=parseInt(hex.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`}
function shDraw(cv){
 const d=shData();if(!d||!cv||!cv.getContext)return null;const [W,H,b0]=SH_SIZES[ui.sh.size];cv.width=W;cv.height=H;const ctx=cv.getContext('2d');if(!ctx)return null;
 const tk=shTokens(ui.sh.style);let L=null,base=b0;for(;base>=26;base-=2){L=shLayout(ctx,d,W,H,base,tk);if(L.fits)break}
 const fits=L&&L.fits;if(!fits)L=shLayout(ctx,d,W,H,26,tk);
 /* background */
 ctx.fillStyle=tk.bg;ctx.fillRect(0,0,W,H);
 if(tk.glow){const g=ctx.createRadialGradient(W/2,-80,10,W/2,-80,900);g.addColorStop(0,tk.glow);g.addColorStop(1,tk.glow.replace(/[\d.]+\)$/,'0)'));ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
 if(tk.sunset){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#eee9f8');g.addColorStop(.38,'#f7eff3');g.addColorStop(.72,'#fcebdf');g.addColorStop(1,'#fbd8bd');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);const r=ctx.createRadialGradient(W/2,H*1.08,10,W/2,H*1.08,1300);r.addColorStop(0,'rgba(255,140,80,.55)');r.addColorStop(.48,'rgba(255,176,120,.24)');r.addColorStop(.74,'rgba(255,176,120,0)');ctx.fillStyle=r;ctx.fillRect(0,0,W,H)}
 const {pad,fs,serif,ui2}=L,top=L.top,x0=pad;
 const sprig=y=>{ctx.save();ctx.strokeStyle=tk.lab;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W/2-60,y);ctx.lineTo(W/2-14,y);ctx.moveTo(W/2+14,y);ctx.lineTo(W/2+60,y);ctx.moveTo(W/2,y+9);ctx.lineTo(W/2,y-10);ctx.stroke();ctx.restore()};
 L.ops.forEach(o=>{
  if(o.k==='lab'){ctx.font=`600 ${Math.round(fs*0.42)}px ${ui2}`;ctx.fillStyle=tk.lab;ctx.textAlign='center';ctx.letterSpacing='4px';ctx.fillText(o.t,W/2,top+o.y);ctx.letterSpacing='0px';ctx.textAlign='left'}
  else if(o.k==='sprig')sprig(top+o.y);
  else if(o.k==='line'){let x=x0;o.l.forEach(t=>{if(t.num){ctx.font=`600 ${Math.round(fs*0.5)}px ${ui2}`;ctx.fillStyle=tk.num;ctx.fillText(t.t,x,top+o.y-fs*0.38);x+=ctx.measureText(t.t).width;return}ctx.font=`${fs}px ${serif}`;const w=ctx.measureText(t.t).width;if(t.hl){ctx.fillStyle=t.mc?shTint(t.mc,tk.dark?.34:.42):tk.hl;ctx.fillRect(x-(t.t.trim()?1:0),top+o.y-fs*0.82,w+(t.t.trim()?2:0),fs*1.08)}ctx.fillStyle=tk.ink;ctx.fillText(t.t,x,top+o.y);if(t.ul&&t.t.trim()){ctx.fillStyle=t.mc||tk.ul;ctx.fillRect(x,top+o.y+fs*0.16,w,Math.max(2,fs*0.06))}x+=w})}
  else if(o.k==='note'){ctx.fillStyle=tk.rule;ctx.fillRect(x0+o.x,top+o.y,3,o.h-fs*0.15);ctx.font=`italic ${Math.round(fs*0.74)}px ${serif}`;ctx.fillStyle=tk.ink;o.lines.forEach((l,i)=>{let x=x0+o.x+fs*0.5;l.forEach(t=>{ctx.fillText(t.t,x,top+o.y+fs*0.74*(i+1)*1.35);x+=t.w})})}
  else if(o.k==='take'){ctx.font=`italic ${Math.round(fs*0.98)}px ${serif}`;ctx.fillStyle=tk.ink;ctx.textAlign='center';ctx.fillText(o.l.map(t=>t.t).join(''),W/2,top+o.y);ctx.textAlign='left'}
 });
 /* footer */
 const fy=H-pad;ctx.font=`${Math.round(fs*0.42)}px ${ui2}`;ctx.fillStyle=tk.lab;
 if(d.badge){const s=fs*0.95;if(shLogo&&shLogo.complete){ctx.save();ctx.beginPath();const r=s*0.22;ctx.moveTo(x0+r,fy-s);ctx.arcTo(x0+s,fy-s,x0+s,fy,r);ctx.arcTo(x0+s,fy,x0,fy,r);ctx.arcTo(x0,fy,x0,fy-s,r);ctx.arcTo(x0,fy-s,x0+s,fy-s,r);ctx.clip();ctx.drawImage(shLogo,x0,fy-s,s,s);ctx.restore()}ctx.font=`600 ${Math.round(fs*0.5)}px ${serif}`;ctx.fillStyle=tk.ink;ctx.fillText('Marginalia',x0+s+fs*0.3,fy-s*0.3)}
 ctx.font=`${Math.round(fs*0.42)}px ${ui2}`;ctx.fillStyle=tk.lab;ctx.textAlign='right';const trl=d.trl.length>70?d.trl.slice(0,68)+'…':d.trl;
 if(d.badge){if(d.name)ctx.fillText(d.name,W-pad,fy-fs*0.6);ctx.fillText(trl,W-pad,fy)}else{ctx.textAlign='left';if(d.name)ctx.fillText(d.name,x0,fy);ctx.textAlign='right';ctx.fillText(trl,W-pad,fy)}
 ctx.textAlign='left';
 return {fits};
}
function shPreview(n){const cv=$('#shcv');if(!cv)return;if(!shData()){if((n||0)<15)setTimeout(()=>shPreview((n||0)+1),300);return}const r=shDraw(cv);const sv=$('#shsave'),sb=$('#shshare'),msg=$('#shmsg');const ok=!r||r.fits;[sv,sb].forEach(b=>b&&(b.disabled=!ok));if(msg)msg.textContent=ok?'':'Too long for this size: choose fewer verses, or Portrait or Story.'}
function renderShare(){
 const sh=ui.sh;if(!sh)return;const st=S.studies[sh.sid].d,r=devRef(st);const s=$('#share');
 const notes=(st.annotations||[]).filter(a=>a.kind==='note'&&a.note).sort((x,y)=>{const a=(x.spans||[{}])[0],b=(y.spans||[{}])[0];return (a.c-b.c)||(a.v-b.v)||(a.s-b.s)});const sections=shSections(st);
 const nNotes=notes.filter(a=>sh.notes.has(a.id)).length;const markCount=(st.annotations||[]).filter(a=>['highlight','underline','circle'].includes(a.kind)).length;
 const L=shVerseList(st);const vopts=(sel)=>L.map((x,i)=>`<option value="${i}"${i===sel?' selected':''}>${x.c}:${x.v}</option>`).join('');
 const sw=`<div class="shsw">${SH_STYLES.map(([k,l])=>`<button class="shst${sh.style===k?' on':''} st-${k}" data-act="shstyle" data-v="${k}" aria-label="${l}" title="${l}"></button>`).join('')}<span class="shdv"></span>${SH_SOLIDS.map(c=>`<button class="shst${sh.style==='solid:'+c?' on':''}" style="background:${c}" data-act="shstyle" data-v="solid:${c}" aria-label="Solid color"></button>`).join('')}</div>`;
 const main=`<div class="shrow"><span class="lbl3">Verses</span><select id="shv1">${vopts(sh.v1)}</select><span class="muted">to</span><select id="shv2">${vopts(sh.v2)}</select></div>
 <div class="shrow"><div class="seg">${[['square','Square'],['portrait','Portrait'],['story','Story']].map(([k,l])=>`<button class="${sh.size===k?'on':''}" data-act="shsize" data-v="${k}">${l}</button>`).join('')}</div></div>
 <div class="shrow"><div class="seg"><button class="${sh.beside?'':'on'}" data-act="shbeside" data-v="0">Notes below</button><button class="${sh.beside?'on':''}" data-act="shbeside" data-v="1">Notes beside</button></div></div>
 <div class="lbl3" style="margin-top:6px">Style · swipe for more colors</div>${sw}
 <button class="shnav" data-act="shpage" data-v="include"><span>Include</span><small>${sh.marks?markCount+' marks':'no marks'} · ${nNotes} of ${notes.length} notes${sh.take&&sh.takeText?' · takeaway':''}</small><span>›</span></button>`;
 const inc=`<button class="shback" data-act="shpage" data-v="main">‹ Back</button>
 <label class="shsw2"><span>Highlights and underlines</span><input type="checkbox" id="shmarks"${sh.marks?' checked':''}></label>
 <div class="lbl3" style="margin-top:10px">Notes <small>Notes stay private until you turn them on</small></div>${notes.length?notes.map(a=>`<label class="shsw2"><span>v${(a.spans||[{}])[0].v} · ${esc(plainMd(a.note).slice(0,60))}</span><input type="checkbox" data-shnote="${esc(a.id)}"${sh.notes.has(a.id)?' checked':''}></label>`).join(''):'<p class="muted">No notes in this reading.</p>'}
 <label class="shsw2" style="margin-top:10px"><span>Takeaway</span><input type="checkbox" id="shtake"${sh.take?' checked':''}></label>${sections.length?`<div class="shrow"><span class="lbl3">From</span><select id="shfrom">${sections.map(x=>`<option${x.h===sh.takeFrom?' selected':''}>${esc(x.h)}</option>`).join('')}</select></div>`:''}<textarea id="shtt" rows="2" placeholder="A line to finish the card">${esc(sh.takeText)}</textarea>
 <div class="lbl3" style="margin-top:10px">Footer</div><label class="shsw2"><span>Your name</span><input type="checkbox" id="shname"${sh.name?' checked':''}></label><input id="shnm" value="${esc(SET.shareName||'')}" placeholder="Your name on cards" autocomplete="name"><label class="shsw2"><span>Marginalia badge</span><input type="checkbox" id="shbadge"${sh.badge?' checked':''}></label><p class="muted" style="font-size:12.5px">${shData()&&shData().copyLocked?'The translation’s copyright line stays on the card.':'The translation line is always on the card.'}</p>`;
 s.innerHTML=`<div class="shbox"><div class="shhd"><button class="quiet" data-act="shclose">Cancel</button><b>Share this reading</b><span style="width:60px"></span></div><div class="shbody"><div class="shpv"><canvas id="shcv" width="1080" height="1350"></canvas><div class="shcap">${({square:'Square',portrait:'Portrait',story:'Story'})[sh.size]} · ${sh.style.startsWith('solid:')?'Solid':SH_STYLES.find(x=>x[0]===sh.style)[1]} · notes ${sh.beside?'beside':'below'}</div></div><div class="shctl">${sh.page==='include'?inc:main}<p class="shmsg" id="shmsg"></p></div></div><div class="shbar"><button class="btn" id="shshare" data-act="shshare">${ic('shareI',16)} Share image…</button><button class="quiet" id="shsave" data-act="shsave">Save image</button><button class="quiet" data-act="shcopy">Copy as text</button></div></div>`;
 s.classList.add('open');$('#scrim').classList.add('show');$('#scrim').dataset.for='share';
 if(!shLogo){shLogo=new Image();shLogo.onload=()=>shPreview();shLogo.src='icons/icon-192.png'}
 const go=()=>shPreview();if(document.fonts&&document.fonts.load)Promise.all([document.fonts.load('20px "Source Serif 4"'),document.fonts.load('italic 20px "Source Serif 4"'),document.fonts.load('20px Figtree')]).then(go,go);else go();
}
function closeShare(){const s=$('#share');if(s){s.classList.remove('open');s.innerHTML=''}ui.sh=null;const sc=$('#scrim');if(sc&&sc.dataset.for==='share'){sc.classList.remove('show');sc.dataset.for=''}}
function shRemember(){const sh=ui.sh;LS.set('share',{size:sh.size,style:sh.style,beside:sh.beside,name:sh.name,badge:sh.badge})}
function shBlob(){return new Promise(res=>{const cv=document.createElement('canvas');shDraw(cv);if(!cv.toBlob)return res(null);cv.toBlob(b=>res(b),'image/png')})}
function shFileName(){const st=S.studies[ui.sh.sid].d;return `${(st.title||'Reading').replace(/[\\/:*?"<>|]+/g,'')} - Share.png`}
document.addEventListener('change',e=>{
 if(!ui.sh)return;const t=e.target,sh=ui.sh;
 if(t.id==='shv1'){sh.v1=+t.value;if(sh.v2<sh.v1)sh.v2=sh.v1;renderShare()}
 else if(t.id==='shv2'){sh.v2=+t.value;if(sh.v1>sh.v2)sh.v1=sh.v2;renderShare()}
 else if(t.id==='shmarks'){sh.marks=t.checked;shPreview()}
 else if(t.dataset.shnote){t.checked?sh.notes.add(t.dataset.shnote):sh.notes.delete(t.dataset.shnote);shPreview()}
 else if(t.id==='shtake'){sh.take=t.checked;shPreview()}
 else if(t.id==='shfrom'){sh.takeFrom=t.value;sh.takeText=shTakeDefault(S.studies[sh.sid].d);renderShare()}
 else if(t.id==='shname'){sh.name=t.checked;shRemember();shPreview()}
 else if(t.id==='shbadge'){sh.badge=t.checked;shRemember();shPreview()}
});
document.addEventListener('input',e=>{if(!ui.sh)return;const t=e.target;if(t.id==='shtt'){ui.sh.takeText=t.value;shPreview()}else if(t.id==='shnm'){SET.shareName=t.value.trim();saveSet();shPreview()}});
/* ===================== 1.6.3: slim lines, Focus pills, continuous Bible, back gesture ===================== */
const BPAGES_OLD={paper:['Paper','#ffffff'],morn:['Morning','#fbf8f2'],parch:['Parchment','#f3ead7'],sage:['Sage','#eef2ea'],mist:['Mist','#eef1f6'],dusk:['Dusk','#2a2433'],eve:['Evening','#1c1a33'],night:['Night','#0f0f10']};
const fxBtn=(on)=>`<button class="pfx${on?' on':''}" data-act="focus" aria-label="${on?'Leave Focus':'Focus'}" title="${on?'Leave Focus':'Focus: just the page'}">${ic('focus',18)}</button>`;
function fxHtml(){return ['bible'].includes(ui.view)&&!(ui.view==='bible'&&ui.bibList)&&!focusOn()?fxBtn(false):''}
function pillHtml(){
 const tail=`<button data-act="menu" data-m="${ui.view==='bible'?'bmore':ui.view==='devmode'?'dmore':'smore'}" aria-label="More">${ic('more',17)}</button>${fxBtn(true)}`;
 if(ui.view==='bible'){const r=bibleRef();return `<button data-act="nav" data-v="home" aria-label="Home">${ic('homeI',17)}</button><button class="bcur" data-act="bpick">${esc(bname(r.b,true))} ${r.c} ▾</button><button data-act="menu" data-m="btr">${esc(trName(bibleTr()))} ▾</button>${tail}`}
 if(ui.view==='devmode')return `<button data-act="dexit">${ic('chevL',16)}Today</button><button class="aa" data-act="txt" aria-label="Reading settings">Aa</button><button data-act="share" aria-label="Share this reading">${ic('shareI',16)}</button>${tail}`;
 const st=cur();if(!st)return '';
 return `<button data-act="rpopen" data-t="notes">${ic('notesI',16)}Notes</button><button data-act="menu" data-m="tr">${esc(trName(studyTr(st)))} ▾</button><button data-act="menu" data-m="filter" aria-label="Filter" class="${filterOn()||FS.just?'on':''}">${ic('filter',16)}</button>${tail}`;
}
/* ---------- study: one slim line ---------- */
function vStudy(){
 const st=cur();if(!st){ui.view='studies';return vStudies()}
 const tr=studyTr(st);ui.tab='passage';const refs=(st.passages||[]).map(p=>refStr(p.ref)).join(', ');
 let body=`${banners()}<div class="studywrap"${ncolStyle()}><div class="fsticky"><b>${esc(st.title||'Untitled')}</b><small>${esc(refs)}</small></div>${pageHead(esc(st.title||'Untitled'),esc(refs))}${headerRow(st,tr)}`;
 (st.passages||[]).forEach(p=>{if((st.passages||[]).length>1)body+=`<div class="pref">${esc(refStr(p.ref))}</div>`;body+=passageRows(st,p,tr)});
 body+=`<div style="height:140px"></div>${MID.matches&&SET.nlay!=='under'&&SET.nlay!=='dots'?'<div class="coldiv" id="coldiv" role="separator" aria-orientation="vertical" aria-label="Scripture and notes width" title="Drag to change the width; double-tap to reset"><span class="knob"></span><span class="wtip"></span></div>':''}</div>`;
 const bar=`<button class="ib" data-act="sidebtn" aria-label="Sidebar" title="Sidebar">${ic('side',18)}</button><div class="bt">${esc(st.title||'Untitled')}</div>${(account||CFG.clientId)?syncDot():''}<span class="sp"></span><button class="ib${rpShown()?' on':''}" data-act="rpbtn" aria-label="Study notes and Guide" title="Study notes and Guide">${ic('rside',18)}</button><button class="ib" data-act="menu" data-m="smore" aria-label="More" title="More">${ic('more',18)}</button>`;
 return {bar:'',body};
}
/* ---------- the Bible: one slim line, continuous chapters ---------- */
function bibNext(b,c){return c<CHAPS[b]?[b,c+1]:b<65?[b+1,1]:null}
function bibPrev(b,c){return c>1?[b,c-1]:b>0?[b-1,CHAPS[b-1]]:null}
function bibSection(b,c,tr,first){
 const ch=chapter(tr,b,c),ins=versesInStudies(b,c),mk=bibleMarks(b,c,tr),today=ui.bibToday&&ui.bibToday.b===b&&ui.bibToday.c===c?ui.bibToday:null;
 const head=`<div class="chbrk">${c===1||first?`<span class="bkn">${esc(bname(b))}</span>`:''}<span class="chn">${c}</span><i></i></div>`;
 if(!ch)return `<section class="bch" data-b="${b}" data-c="${c}">${head}<p class="muted" style="padding:10px 0">${CHERR[chKey(tr,b,c)]?'Couldn’t load this chapter. <button class="quiet" data-act="bretry">Try again</button>':'Loading…'}</p></section>`;
 const para=curLayout()==='para';const vt=(t,v)=>{const tv=today&&v>=today.v1&&v<=today.v2;return `<span class="vn" id="bv-${b}-${c}-${v}"${first?` data-first="${v}"`:''}>${v}</span>${ins[v]?`<button class="bdot" data-act="bstudy" data-b="${b}" data-c="${c}" data-v="${v}" aria-label="In ${ins[v].length} stud${ins[v].length===1?'y':'ies'}"></button>`:''}<span class="vtx${tv?' today-v':''}" data-p="bible" data-b="${b}" data-c="${c}" data-v="${v}">${markedVerse(t,mk[v])}</span> `};
 let rows;if(para){let h='<p class="vt">';ch.v.forEach((t,i)=>{const v=i+1;if(ch.p&&ch.p.includes(v)&&v>1)h+='</p><p class="vt">';h+=vt(t,v)});rows=`<div class="btext para">${h}</p></div>`}
 else rows=`<div class="btext">${ch.v.map((t,i)=>`<p class="vt">${vt(t,i+1)}</p>`).join('')}</div>`;
 return `<section class="bch" data-b="${b}" data-c="${c}">${head}${rows}</section>`;
}
function vBible(){
 if(ui.bibList)return vBibleList();
 const r=bibleRef(),tr=bibleTr(),page=bibPageGet();
 if(!ui.bibChs||!ui.bibChs.length)ui.bibChs=[[r.b,r.c]];
 const anim=ui.bibAnim?` anim-${ui.bibAnim}`:'';ui.bibAnim=null;
 const back=ui.bibToday?`<button class="bback" data-act="devback">← Back to today’s reading</button>`:'';
 const prevC=bibPrev(ui.bibChs[0][0],ui.bibChs[0][1]);const body=`${banners()}<div class="studywrap bible page-${page}${anim}"><div class="fsticky bsticky"><b class="bcur">${esc(bname(r.b))} ${r.c}</b></div>${pageHead(`<span class="bcur">${esc(bname(r.b))} ${r.c}</span>`,esc(trName(tr)))}${back}${prevC?`<button class="bprevch" data-act="bprevch">↑ ${esc(bname(prevC[0],true))} ${prevC[1]}</button>`:''}${ui.bibChs.map(([b,c],i)=>bibSection(b,c,tr,i===0)).join('')}<div style="height:140px"></div></div>`;
 const bar=`<button class="ib" data-act="sidebtn" aria-label="Sidebar" title="Sidebar">${ic('side',18)}</button><button class="bt bcur slimref" data-act="bpick">${esc(bname(r.b,true))} ${r.c} ▾</button><button class="slimtr" data-act="menu" data-m="btr">${esc(trName(tr))} ▾</button><span class="sp"></span><button class="ib" data-act="menu" data-m="bmore" aria-label="More" title="More">${ic('more',18)}</button>`;
 return {bar:'',body};
}
function bibJump(b,c,dir){ui.bib={b,c};ui.bibChs=[[b,c]];ui.bibAnim=dir||'fade';LS.set('bibAt',Object.assign({},LS.get('bibAt',{}),{b,c,v:1,at:Date.now()}));clearOwnSel();hideBar();lastKey='';render();const bd=$('#body');if(bd)bd.scrollTop=0}
/* as you scroll: the current chapter follows; the next chapter loads below, the one before above */
let bibBusy=false;
function bibTrack(){
 if(ui.view!=='bible'||ui.bibList)return;const bd=$('#body');if(!bd)return;const top=bd.getBoundingClientRect().top+70;
 const secs=[...document.querySelectorAll('.bch')];if(!secs.length)return;
 let cur=secs[0];for(const s of secs){if(s.getBoundingClientRect().top<=top)cur=s;else break}
 const b=+cur.dataset.b,c=+cur.dataset.c;
 if(!ui.bib||ui.bib.b!==b||ui.bib.c!==c){ui.bib={b,c};document.querySelectorAll('.bcur, #fx .txtp[data-act=bpick]').forEach(el=>{el.textContent=el.classList.contains('slimref')||(el.closest('#fx'))?`${bname(b,true)} ${c} ▾`:`${bname(b)} ${c}`});ui._lastRec=null}
 const vs=[...cur.querySelectorAll('.vn')];let v=1;for(const el of vs){if(el.getBoundingClientRect().top<=top)v=+el.textContent;else break}
 clearTimeout(bibSaveT);bibSaveT=setTimeout(()=>{LS.set('bibAt',{b,c,v,n:vs.length,at:Date.now()});if(cur.getBoundingClientRect().bottom<=bd.getBoundingClientRect().bottom+40){const rd=LS.get('bibRead',{});rd[b]=[...new Set([...(rd[b]||[]),c])];LS.set('bibRead',rd)}pushRecent({k:'bible',id:b+':'+c,t:`${bname(b,true)} ${c}`})},300);
 if(bibBusy)return;const tr=bibleTr();
 if(bd.scrollTop+bd.clientHeight>bd.scrollHeight-900){const [lb,lc]=ui.bibChs[ui.bibChs.length-1];const n=bibNext(lb,lc);if(n&&chapter(tr,lb,lc)){bibBusy=true;ui.bibChs.push(n);if(ui.bibChs.length>8){const h0=document.querySelector('.bch').offsetHeight;ui.bibChs.shift();render();bd.scrollTop-=h0}else render();bibBusy=false}}
 else if(bd.scrollTop<250){const [fb,fc]=ui.bibChs[0];const p=bibPrev(fb,fc);if(p){if(!chapter(tr,p[0],p[1]))return;bibBusy=true;const h=bd.scrollHeight,t0=bd.scrollTop;ui.bibChs.unshift(p);if(ui.bibChs.length>8)ui.bibChs.pop();lastKey='';render();bd.scrollTop=t0+(bd.scrollHeight-h);bibBusy=false}}
}
/* ---------- the Bible list in the sidebar ---------- */
function sideBibleHtml(){
 const at=bibleRef(),read=LS.get('bibRead',{}),marked=booksMarked();if(ui.sbOpen==null)ui.sbOpen=at.b;if(!ui.sbTest)ui.sbTest=ui.sbOpen>=39?'nt':'ot';const test=ui.sbTest,open=ui.sbOpen;
 return `<div class="pl2 sbl"><input id="sbq" class="sbq" placeholder="Type a passage" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go"><div class="sbqh" id="sbqh"></div><div class="tabs2"><button class="${test==='ot'?'on':''}" data-act="sbtest" data-t="ot">Old Testament</button><button class="${test==='nt'?'on':''}" data-act="sbtest" data-t="nt">New Testament</button></div>${BGROUPS.filter(g=>g[0]===test).map(([,l,a,z])=>`<div class="grp2">${l}</div>${Array.from({length:z-a},(_,i)=>a+i).map(b=>`<button class="bk2${open===b?' on':''}" data-act="sbbook" data-b="${open===b?-1:b}">${marked.has(b)&&open!==b?'<span class="bkdot"></span>':''}${esc(BOOKS[b])}</button>${open===b?`<div class="chrow">${Array.from({length:CHAPS[b]},(_,i)=>i+1).map(c=>`<button class="${b===at.b&&c===at.c&&ui.view==='bible'?'on':''}" data-act="sbgo" data-b="${b}" data-c="${c}">${c}</button>`).join('')}</div>`:''}`).join('')}`).join('')}</div>`;
}
/* ---------- the back gesture ---------- */
let navSnap=null,navLayer=false,ignorePop=0;
const snapNow=()=>({view:ui.view,sid:ui.sid,devSid:ui.devSid,bib:ui.view==='bible'?Object.assign({},bibleRef()):null,bibList:!!ui.bibList});
const layerOpen=()=>!!(ui.sideOver||ui.rpOver||ui.sh||ui.otOpen||($('#sheet')&&$('#sheet').classList.contains('open'))||($('#tx')&&$('#tx').classList.contains('open'))||($('#menu')&&$('#menu').classList.contains('open')));
function navTrack(){
 if(ignorePop)return;const s=snapNow(),k=JSON.stringify(s);
 if(!navSnap){history.replaceState({mg:s},'');navSnap=k;return}
 if(k!==navSnap){if(navLayer){navLayer=false;history.replaceState({mg:s},'')}else history.pushState({mg:s},'');navSnap=k}
 const lo=layerOpen();if(lo&&!navLayer){history.pushState({mg:s,layer:1},'');navLayer=true}
 else if(!lo&&navLayer){navLayer=false;ignorePop++;history.back()}
}
function closeLayers(){closeMenu();closeSheet();closeShare();const tx=$('#tx');if(tx&&tx.classList.contains('open')&&A.txtx)A.txtx();ui.sideOver=false;ui.rpOver=false;if(ui.otOpen){const ae=document.activeElement;if(ae&&ae.id==='devnotes')ae.blur();ui.otOpen=false;ui.pendRender=false}}
addEventListener('popstate',e=>{
 if(ignorePop){ignorePop--;return}
 if(navLayer||layerOpen()){navLayer=false;closeLayers();ignorePop++;render();ignorePop--;return}
 const s=e.state&&e.state.mg;if(!s)return;
 ignorePop++;ui.view=s.view;ui.sid=s.sid;ui.devSid=s.devSid;ui.bibList=s.bibList;if(s.bib){ui.bib=s.bib;ui.bibChs=[[s.bib.b,s.bib.c]]}clearOwnSel();hideBar();closeEd(true);lastKey='';render();ignorePop--;navSnap=JSON.stringify(snapNow());
});

const DSETI='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>';/* ===================== 1.6.5 ===================== */
/* ---------- selection across verses ---------- */
function ptNode(vtx,off){const w=document.createTreeWalker(vtx,NodeFilter.SHOW_TEXT);let n,pos=0,last=null;while((n=w.nextNode())){last=n;if(off<=pos+n.data.length)return [n,off-pos];pos+=n.data.length}return last?[last,last.data.length]:[vtx,0]}
function selRange(d){const r=document.createRange();const a=ptNode(d.vtx,d.s),b=ptNode(d.vtx2||d.vtx,d.e);try{r.setStart(a[0],a[1]);r.setEnd(b[0],b[1])}catch(x){}return r}
function pointAt(x,y,group){
 let node,off;
 if(document.caretRangeFromPoint){const r=document.caretRangeFromPoint(x,y);if(!r)return null;node=r.startContainer;off=r.startOffset}
 else if(document.caretPositionFromPoint){const p=document.caretPositionFromPoint(x,y);if(!p)return null;node=p.offsetNode;off=p.offset}else return null;
 const el=node.nodeType===1?node:node.parentElement;let vtx=el&&el.closest&&el.closest('.vtx');
 if(!vtx){const near=[...document.querySelectorAll('.vtx')].filter(v=>v.dataset.p===group);let best=null,bd=1e9;near.forEach(v=>{const rr=v.getBoundingClientRect();const dd=y<rr.top?rr.top-y:y>rr.bottom?y-rr.bottom:0;if(dd<bd){bd=dd;best=v}});if(!best||bd>40)return null;vtx=best;const rr=vtx.getBoundingClientRect();return {vtx,off:y<rr.top?0:vtx.textContent.length}}
 if(vtx.dataset.p!==group)return null;
 return {vtx,off:offIn(vtx,node,off)};
}
const before=(a,b)=>a.vtx===b.vtx?a.off<b.off:!!(a.vtx.compareDocumentPosition(b.vtx)&Node.DOCUMENT_POSITION_FOLLOWING);
function drawSel(){
 const d=ui.selDrag;if(!d)return;const r=selRange(d);
 if(window.CSS&&CSS.highlights&&window.Highlight){CSS.highlights.set('mgsel',new Highlight(r))}
 const rects=r.getClientRects?[...r.getClientRects()].filter(x=>x.width>1):[];const k=$('#selk');if(!k)return;k.classList.add('show');if(!rects.length){k.innerHTML='';return}
 const a=rects[0],b=rects[rects.length-1];
 k.innerHTML=rects.map(x=>`<b class="st" style="left:${x.left}px;top:${x.top}px;width:${x.width}px;height:${x.height}px"></b>`).join('')+`<i class="k1" style="left:${a.left-6}px;top:${a.top-8}px;height:${a.height+8}px"></i><i class="k2" style="left:${b.right-6}px;top:${b.top}px;height:${b.height+8}px"></i>`;k.classList.add('show');
}
function selVerses(d){if(!d.vtx2||d.vtx2===d.vtx)return [d.vtx];const all=[...document.querySelectorAll('.vtx')].filter(v=>v.dataset.p===d.vtx.dataset.p);const i=all.indexOf(d.vtx),j=all.indexOf(d.vtx2);return i<0||j<0?[d.vtx]:all.slice(i,j+1)}
function finishOwnSel(){
 const d=ui.selDrag;if(!d)return;const vs=selVerses(d);
 const parts=vs.map((v,i)=>{const t=v.textContent;let s=i===0?d.s:0,e=i===vs.length-1?d.e:t.length;while(s<e&&/\s/.test(t[s]))s++;while(e>s&&/\s/.test(t[e-1]))e--;return {vtx:v,b:+v.dataset.b||null,c:+v.dataset.c,v:+v.dataset.v,s,e,text:t.slice(s,e)}}).filter(x=>x.e>x.s);
 if(!parts.length){clearOwnSel();return}
 const f=parts[0];
 ui.sel={p:f.vtx.dataset.p,b:f.b,c:f.c,v:f.v,s:f.s,e:f.e,w:parts.map(x=>x.text).join(' '),multi:parts.length>1?parts.map(({vtx,...x})=>x):null};
 if(ui.edit)closeEd(true);
 ui.barMore=false;ui.bar={mode:'new'};const rr=selRange(d);showBar(rr.getBoundingClientRect?rr.getBoundingClientRect():f.vtx.getBoundingClientRect());
}
function selectWords(vtx,s,e,vtx2,e2){ui.selDrag={vtx,s,vtx2:vtx2||vtx,e:vtx2?e2:e,anc:{vtx,s,e}};drawSel();finishOwnSel()}
function startAt(x,y,target){
 const vtx=target.closest&&target.closest('.vtx');if(!vtx)return false;
 const o=caretIn(vtx,x,y);if(o==null)return false;const [s,e]=wordBounds(vtx.textContent,o);
 hideBar();ui.selDrag={vtx,s,vtx2:vtx,e,anc:{vtx,s,e}};drawSel();return true;
}
function extendTo(x,y){
 const d=ui.selDrag;if(!d)return;const P=pointAt(x,y,d.vtx.dataset.p);if(!P)return;const [ws,we]=wordBounds(P.vtx.textContent,P.off);
 const st={vtx:d.vtx,off:d.s},en={vtx:d.vtx2,off:d.e};
 if(d.handle==='start'){const n={vtx:P.vtx,off:ws};if(before(n,en)){d.vtx=P.vtx;d.s=ws}}
 else if(d.handle==='end'){const n={vtx:P.vtx,off:we};if(before(st,n)){d.vtx2=P.vtx;d.e=we}}
 else{const A=d.anc;if(before({vtx:P.vtx,off:ws},{vtx:A.vtx,off:A.s})){d.vtx=P.vtx;d.s=ws;d.vtx2=A.vtx;d.e=A.e}else{d.vtx=A.vtx;d.s=A.s;d.vtx2=P.vtx;d.e=Math.max(we,P.vtx===A.vtx?A.e:we)}}
 drawSel();
 const bd=$('#body');if(bd){const r=bd.getBoundingClientRect();if(y<r.top+56)bd.scrollTop-=14;else if(y>r.bottom-56)bd.scrollTop+=14}
}
function selRefStr(sl){const b=sl.b!=null?sl.b:bibleRef().b;let s=`${bname(b,true)} ${sl.c}:${sl.v}`;if(sl.multi){const l=sl.multi[sl.multi.length-1];s+='–'+(l.c!==sl.c?l.c+':':'')+l.v}return s}

/* ---------- one settings button on every reading page ---------- */
Object.assign(ICO,{'mg-fin':'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>','mg-fout':'<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>'});
Object.assign(IC_ALIAS,{fin:'mg-fin',fout:'mg-fout'});
function spillItems(){
 const f=focusOn();const fx=ui.view==='devmode'?'':`<button class="fxb${f?' on':''}" data-act="focus" aria-label="${f?'Leave Focus':'Focus'}" title="${f?'Leave Focus':'Focus'}">${ic(f?'fout':'fin',17)}</button>`;
 const aa=`<button class="aa" data-act="txt" aria-label="Reading settings" title="Reading settings">Aa</button>`;
 const sq=`<button data-act="cmdopen" aria-label="Command box" title="Go to, do or change anything">${ic('search',17)}</button>`;
 if(ui.view==='bible'){const r=bibleRef();return `${sq}<button class="txtp" data-act="bpick">${esc(bname(r.b,true))} ${r.c} ▾</button><button class="txtp mut" data-act="menu" data-m="btr">${esc(trName(bibleTr()))} ▾</button>${aa}${fx}`}
 if(ui.view==='devmode')return `${sq}<button data-act="dexit" aria-label="Devotional home" title="Devotional home">${ic('sunrise',18)}</button>${aa}<button data-act="share" aria-label="Share this reading" title="Share this reading">${ic('shareI',17)}</button><button data-act="otopen" class="${ui.otOpen?'on':''}" aria-label="Overall thoughts" title="Overall thoughts">${ic('journal',17)}</button><button data-act="menu" data-m="dmore" aria-label="More" title="More">${ic('more',17)}</button>`;
 return `${sq}<button data-act="rpopen" data-t="notes" aria-label="Study notes" title="Study notes" class="${rpShown()?'on':''}">${ic('notesI',17)}</button><button data-act="menu" data-m="filter" aria-label="Filter" title="Filter" class="${filterOn()||FS.just?'on':''}">${ic('filter',17)}</button>${aa}${fx}`;
}
function fxHtml(){
 if(!['study','bible','devmode'].includes(ui.view)||(ui.view==='bible'&&ui.bibList))return '';
 return `<div class="spill${ui.spOpen?' open':''}">${ui.spOpen?spillItems():''}<button class="spb${ui.spOpen?' on':''}" data-act="spill" aria-label="${ui.spOpen?'Close settings':'Settings'}" title="Settings">${DSETI}</button></div>`;
}
function pillHtml(){return ''}
function spTimer(){clearTimeout(ui._spT);if(ui.spOpen)ui._spT=setTimeout(()=>{if(ui.spOpen&&!$('#menu.open')&&!$('#tx.open')){ui.spOpen=false;render()}else spTimer()},6000)}

/* ---------- the page heading (no top bar) ---------- */
function pageHead(title,sub,extra){return `<div class="phead"><button class="ib sideb" data-act="sidebtn" aria-label="Sidebar" title="Sidebar">${ic('side',18)}</button><h1>${title}</h1>${sub?`<small>${sub}</small>`:''}${extra||''}</div>`}
/* ---------- autofill in the passage lines ---------- */
Object.assign(ALIAS,{matt:39,mat:39,mrk:40,mar:40,luk:41,luke:41,jhn:42,act:43,acts:43,gal:47,eph:48,col:50,heb:57,phm:56,obad:30,ob:30,hab:34,zeph:35,hag:36,zech:37,mal:38,neh:15,est:16,esth:16,hos:27,joel:28,amos:29,jon:31,jnh:31,mic:32,nah:33,job:17,ruth:7,ezr:14,ezra:14,'1sam':8,'2sam':9,'1kgs':10,'2kgs':11,'1ki':10,'2ki':11,'1chr':12,'2chr':13,'1cor':45,'2cor':46,'1thess':51,'2thess':52,'1th':51,'2th':52,'1tim':53,'2tim':54,'tit':55,'1pet':59,'2pet':60,'1pt':59,'2pt':60,'1jn':61,'2jn':62,'3jn':63,'1john':61,'2john':62,'3john':63,jude:64,php:49,phil:49});
const normBook=s=>String(s).toLowerCase().replace(/^iii\s*/,'3').replace(/^ii\s*/,'2').replace(/^i(?=[a-z]{2})(?!s|n)/,'1').replace(/[\s.]/g,'');
function bookMatches(q){const k=normBook(q);if(!k)return [];const read=LS.get('bibRead',{});const out=[];if(ALIAS[k]!=null)out.push(ALIAS[k]);BOOKKEYS.forEach((bk,i)=>{if(bk.startsWith(k)&&!out.includes(i))out.push(i)});Object.keys(ALIAS).forEach(a=>{if(a.startsWith(k)&&!out.includes(ALIAS[a]))out.push(ALIAS[a])});return out.slice(0,1).concat(out.slice(1).sort((a,b)=>((read[b]||[]).length-(read[a]||[]).length)||a-b)).slice(0,7)}
function autofill(inp,e){
 const v=inp.value,hint=document.getElementById(inp.id==='bq'?'bqhint':'sbqh');
 const book=v.match(/^\s*((?:[123]\s*)?[A-Za-z][A-Za-z .]*?)\s*$/);
 if(book){const ms=bookMatches(book[1]);
  if(hint)hint.innerHTML=ms.length>1?ms.map(b=>`<button class="bqchip" data-act="bqpick" data-b="${b}" data-for="${inp.id}">${esc(BOOKS[b])}</button>`).join(''):'';
  const typing=e&&e.inputType&&e.inputType.startsWith('insert')&&inp.selectionStart===v.length;
  if(ms.length&&typing){const full=BOOKS[ms[0]];if(full.toLowerCase().startsWith(v.toLowerCase())&&full.length>v.length){inp.value=full;inp.setSelectionRange(v.length,full.length)}}
  return}
 const r=parseRef(v);if(hint)hint.innerHTML=r?`<span class="bqgo">→ ${esc(BOOKS[r.b])} ${r.c1}${r.whole?'':':'+r.v1}</span>`:'';
}

/* the Bible: add the next chapter in place; fill a chapter when its text arrives */
function bibFill(tr,b,c){if(ui.view!=='bible'||ui.bibList||tr!==bibleTr())return false;const sec=document.querySelector(`.bch[data-b="${b}"][data-c="${c}"]`);if(!sec)return false;const first=sec===document.querySelector('.bch');sec.outerHTML=bibSection(b,c,tr,first);return true}
let bibIdleT2=0;
function bibTrack2(){if(ui.view!=='bible'||ui.bibList)return;const bd=$('#body');if(!bd)return;clearTimeout(bibIdleT2);bibIdleT2=setTimeout(()=>{if(bd.scrollTop+bd.clientHeight<bd.scrollHeight-2*bd.clientHeight)return;const [lb,lc]=ui.bibChs[ui.bibChs.length-1];const n=bibNext(lb,lc);if(!n||ui.bibChs.length>=40)return;const wrap=document.querySelector('.studywrap.bible');const spacer=wrap&&wrap.lastElementChild;if(!spacer)return;ui.bibChs.push(n);chapter(bibleTr(),n[0],n[1]);spacer.insertAdjacentHTML('beforebegin',bibSection(n[0],n[1],bibleTr(),false))},120)}
function isDarkTheme(){const t=document.documentElement.dataset.theme;return t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches)}
const BPAGES={light:['Light','#ffffff'],sepia:['Sepia','#f4ecd8'],dark:['Dark','#1f2125'],black:['Black','#000000']};
function bibPageGet(){const m={paper:'',morn:'sepia',parch:'sepia',sage:'light',mist:'light',dusk:'dark',eve:'dark',night:'black'};let v=LS.get('bibPage','');if(v in m){v=m[v];LS.set('bibPage',v)}return BPAGES[v]?v:''}/* ===================== 1.7: command box; reading settings in one light style; devotional navigation ===================== */
Object.assign(ICO,{
 'mg-sunrise':'<path d="M2.5 17.5h19M7 21h10M12 6.2v2.3M5.4 9.1l1.6 1.6M18.6 9.1L17 10.7M7 17.5a5 5 0 0 1 10 0z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
 'mg-journal':'<path d="M6 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="currentColor" stroke-linejoin="round"/><path d="M8 3v18M11 8h4M11 12h4" stroke="currentColor" stroke-linecap="round"/>'});
Object.assign(IC_ALIAS,{sunrise:'mg-sunrise',journal:'mg-journal'});

/* ---------- reading settings (Aa): this page's choices first, the text look below ---------- */
function trChoices(){if(ui.view==='bible')return Object.keys(TRS).filter(trAvailable);const st=ui.view==='devmode'?(S.studies[ui.devSid]&&S.studies[ui.devSid].d):cur();return [...new Set([...((st&&st.translations)||[]),'kjv','web','esv','net','nkjv'])].filter(t=>TRS[t]&&TRS[t].src!=='none'&&trAvailable(t))}
function curTr(){if(ui.view==='bible')return bibleTr();if(ui.view==='devmode'){const st=S.studies[ui.devSid]&&S.studies[ui.devSid].d;return st?((st.translations||[])[0]||devoTr()):devoTr()}const st=cur();return st?studyTr(st):'kjv'}
function txtHtml(){
 const t=tset(),v=ui.view;
 const head=(title,back)=>`<div class="grab"></div><div class="ahd">${back?`<button class="aback" data-act="txback">‹ Reading</button>`:''}<b>${title}</b><span class="sp"></span>${ib('x','txtx','Close')}</div>`;
 if(ui.txPage==='tr'){const act=v==='bible'?'bsettr':v==='devmode'?'dsettr':'settr';const cu=curTr();return head('Translation',1)+`<div class="alist">${trChoices().map(k=>`<button class="${k===cu?'on':''}" data-act="${act}" data-tr="${esc(k)}"><span class="ck">${k===cu?'✓':''}</span><b>${esc(trName(k))}</b><small>${esc(((TRS[k]&&TRS[k].n)||'')===trName(k)?'':((TRS[k]&&TRS[k].n)||''))}</small></button>`).join('')}</div>`}
 if(ui.txPage==='font')return head('Font',1)+`<div class="alist">${FONTS.map(([k,l,f])=>`<button class="${t.font===k?'on':''}" data-act="tfont" data-k="${k}"><span class="ck">${t.font===k?'✓':''}</span><b style="font-family:${f.replace(/"/g,'&quot;')};font-weight:500">${l}</b></button>`).join('')}</div>`;
 const opt=(act,list,on,attr='v')=>`<div class="alt">${list.map(([val,l])=>`<button class="${String(val)===String(on)?'on':''}" data-act="${act}" data-${attr}="${val}">${l}</button>`).join('')}</div>`;
 const row=(l,c)=>`<div class="arow"><span class="al">${l}</span>${c}</div>`;
 const link=(l,val,act,style)=>`<button class="arow alink" data-act="txpage" data-p="${act}"><span class="al">${l}</span><span class="av"${style?` style="${style}"`:''}>${val}</span><span class="ach">›</span></button>`;
 const tr=curTr();const trLong=(TRS[tr]&&TRS[tr].n)||'';const trRow=link('Translation',`<b>${esc(trName(tr))}</b>${trLong&&trLong!==trName(tr)?' '+esc(trLong):''}`,'tr');
 const lay=row('Layout',opt('tlay',[['verse','Verses'],['para','Paragraphs']],curLayout()));
 let mine='';
 if(v==='study'&&cur()){const n=(SET.nlay||'margin')==='margin'&&!MID.matches?'under':(SET.nlay||'margin');mine=`<div class="asec">This study</div>${trRow}${lay}${row('Notes',opt('nlay',[['margin','Margin'],['under','Under'],['dots','Dots'],['hidden','Hidden']].filter(([k])=>k!=='margin'||MID.matches),n))}`}
 else if(v==='bible'){const pg=bibPageGet()||(isDarkTheme()?'dark':'light');mine=`<div class="asec">This page</div>${trRow}${lay}${row('Page',`<div class="acirc">${Object.entries(BPAGES).map(([k,[l,c]])=>`<button class="${pg===k?'on':''}" data-act="bpage" data-v="${k}" aria-label="${l}"><i style="background:${c}"></i>${l}</button>`).join('')}</div>`)}`}
 else if(v==='devmode'){const cm=SET.devHide?'hidden':(SET.devMargin===false||!MID.matches)?'under':'beside';mine=`<div class="asec">This reading</div>${trRow}${lay}${row('Comments',opt('dcm',[['beside','Beside'],['under','Under'],['hidden','Hidden']].filter(([k])=>k!=='beside'||MID.matches),cm))}${row('Light',opt('dlight',[['hour','By the hour'],['day','Always day']],SET.devLight==='day'?'day':'hour'))}`}
 const fontName=(FONTS.find(f=>f[0]===t.font)||FONTS[0]);
 const text=`<div class="asec">Text</div>${link('Font',esc(fontName[1]),'font',`font-family:${fontName[2].replace(/"/g,'&quot;')}`)}${row('Size',`<div class="asz"><button data-act="tsize" data-d="-1" aria-label="Smaller">A</button><input type="range" id="tsz" min="0.8" max="1.6" step="0.05" value="${t.size}" aria-label="Text size"><button data-act="tsize" data-d="1" aria-label="Larger" style="font-size:18px">A</button></div>`)}${row('Spacing',opt('tlh',LH.map(([val,l])=>[val,l]),t.lh))}${row('Verse nos.',opt('tvn',[['1','Show'],['0','Hide']],t.vn?'1':'0'))}`;
 return head('Reading')+mine+text+`<div class="afoot"><button class="quiet" data-act="treset">Reset to the defaults</button></div>`;
}
/* any choice in the panel redraws it in place (the panel stays open) */
document.addEventListener('click',e=>{const b=e.target.closest('#tx [data-act]');if(!b)return;const a=b.dataset.act;if(['txtx'].includes(a))return;setTimeout(()=>{const x=$('#tx');if(x&&x.classList.contains('open'))refreshTx(x)},0)});

/* ---------- the command box ---------- */
let cmdSel=0,cmdList=[];
function cmdRecent(){return LS.get('cmdRecent',[])}
function cmdRemember(it){const r=cmdRecent().filter(x=>x.id!==it.id);r.unshift({id:it.id,label:it.label,sub:it.sub||'',kind:it.kind,arg:it.arg});LS.set('cmdRecent',r.slice(0,6))}
function cmdItems(q){
 const out=[],Q=q.trim().toLowerCase(),has=s=>String(s).toLowerCase().includes(Q);
 const add=(g,id,label,sub,kind,arg,icon)=>out.push({g,id,label,sub,kind,arg,icon});
 if(!Q){cmdRecent().forEach(r=>add('Recent',r.id,r.label,r.sub,r.kind,r.arg,'clock'));
  add('Go to','home','Home','','nav','home','homeI');add('Go to','bible','Bible','','nav','bible','bibleI');add('Go to','devo','Devotional','','nav','devo','sunrise');add('Go to','settings','Settings','','nav','settings','sliders');return out}
 const r=parseRef(q);
 if(r){const lbl=`${BOOKS[r.b]} ${r.c1}${r.whole?'':':'+r.v1}`;add('Go to','ref:'+lbl,lbl,'Open in the Bible','ref',{b:r.b,c:r.c1,v:r.whole?0:r.v1},'bibleI');
  studyList().filter(s=>s.kind!=='devotional'&&(s.passages||[]).some(p=>p.ref&&p.ref.b===r.b&&r.c1>=p.ref.c1&&r.c1<=(p.ref.c2||p.ref.c1))).slice(0,3).forEach(s=>add('Studies','s:'+s.id,s.title||'Untitled',(s.passages||[]).map(p=>refStr(p.ref)).join(', '),'study',s.id,'book'));
  add('Actions','new:'+lbl,'New study at '+lbl,'','newat',lbl,'plusI')}
 else{bookMatches(q).slice(0,3).forEach(b=>add('Go to','book:'+b,BOOKS[b],'Choose a chapter','book',b,'bibleI'))}
 [['home','Home','homeI'],['bible','Bible','bibleI'],['devo','Devotional','sunrise'],['settings','Settings','sliders']].forEach(([k,l,i])=>{if(has(l))add('Go to',k,l,'','nav',k,i)});
 if(has("today's reading")||has('today'))add('Go to','today','Today’s reading','','today',0,'sunrise');
 if(!r)studyList().filter(s=>s.kind!=='devotional'&&has(s.title||'')).slice(0,5).forEach(s=>add('Studies','s:'+s.id,s.title||'Untitled',(s.passages||[]).map(p=>refStr(p.ref)).join(', '),'study',s.id,'book'));
 const acts=[['focus',focusOn()?'Leave Focus':'Focus',()=>['study','bible'].includes(ui.view),'fin'],['newstudy','New study',()=>1,'plusI'],['share','Share this reading',()=>ui.view==='devmode','shareI'],['filter','Filter notes…',()=>ui.view==='study','filter'],['notes','Study notes',()=>ui.view==='study','notesI'],['thoughts','Overall thoughts',()=>ui.view==='devmode','journal'],['aa','Reading settings',()=>['study','bible','devmode'].includes(ui.view),'sliders']];
 acts.forEach(([k,l,ok,i])=>{if(ok()&&(has(l)||(k==='aa'&&has('aa'))))add('Actions','a:'+k,l,'','act',k,i)});
 if(ui.view==='bible')Object.entries(BPAGES).forEach(([k,[l]])=>{if(has(l)||has('page')||has('color'))add('Settings','pg:'+k,'Page color: '+l,'Bible','page',k,'sliders')});
 if(['study','bible','devmode'].includes(ui.view))trChoices().forEach(k=>{if(has(trName(k))||has((TRS[k]&&TRS[k].n)||'')||has('translation'))add('Settings','tr:'+k,'Translation: '+trName(k),(TRS[k]&&TRS[k].n)||'','tr',k,'bibleI')});
 if(ui.view==='study')[['margin','Margin'],['under','Under'],['dots','Dots'],['hidden','Hidden']].filter(([k])=>k!=='margin'||MID.matches).forEach(([k,l])=>{if(has(l)||has('notes'))add('Settings','nl:'+k,'Notes: '+l,'','nlay',k,'notesI')});
 [['verse','Verses'],['para','Paragraphs']].forEach(([k,l])=>{if(['study','bible','devmode'].includes(ui.view)&&(has(l)||has('layout')))add('Settings','ly:'+k,'Layout: '+l,'','lay',k,'sliders')});
 [['auto','Automatic'],['light','Light'],['dark','Dark']].forEach(([k,l])=>{if(has('theme')||has('appearance')||(has(l)&&k!=='auto'&&ui.view!=='bible'))add('Settings','th:'+k,'Appearance: '+l,'','theme',k,'sliders')});
 FONTS.forEach(([k,l])=>{if(has(l)||has('font'))add('Settings','f:'+k,'Font: '+l,'','font',k,'sliders')});
 add('Search','q:'+q,`Search for “${q.trim()}”`,'All studies and notes','search',q.trim(),'search');
 return out;
}
function cmdRun(it){
 closeCmd();if(it.id&&it.kind!=='search')cmdRemember(it);
 const k=it.kind,a=it.arg;
 if(k==='nav')return A.nav({dataset:{v:a},closest:()=>null});
 if(k==='today'){const s=devFor(dkey(new Date()));return s?A.devopen({dataset:{s:s.id}}):A.nav({dataset:{v:'devo'},closest:()=>null})}
 if(k==='ref'){A.bgo({dataset:{b:a.b,c:a.c}});if(a.v>1)setTimeout(()=>{const el=document.getElementById(`bv-${a.b}-${a.c}-${a.v}`);if(el){el.scrollIntoView({block:'start'});$('#body').scrollTop-=70}},400);return}
 if(k==='book')return A.bopenlist(),(ui.bpickB=a,ui.bibTest=a>=39?'nt':'ot',render());
 if(k==='study')return A.open({dataset:{s:a}});
 if(k==='newat')return newStudyForm({ref:a,tr:ui.view==='bible'?bibleTr():undefined});
 if(k==='act'){if(a==='focus')return A.focus();if(a==='newstudy')return A.newstudy();if(a==='share')return A.share();if(a==='filter')return A.menu({dataset:{m:'filter'},getBoundingClientRect:()=>({left:innerWidth/2-120,right:innerWidth/2+120,top:120,bottom:120,width:240,height:0})});if(a==='notes')return A.rpopen({dataset:{t:'notes'}});if(a==='thoughts')return A.otopen();if(a==='aa')return A.txt()}
 if(k==='page')return A.bpage({dataset:{v:a}});
 if(k==='tr'){if(ui.view==='bible')return A.bsettr({dataset:{tr:a}});if(ui.view==='devmode')return A.dsettr({dataset:{tr:a}});return A.settr({dataset:{tr:a}})}
 if(k==='nlay')return A.nlay({dataset:{v:a},closest:()=>null});
 if(k==='lay')return setText({layout:a});
 if(k==='theme')return A.theme({dataset:{t:a}});
 if(k==='font')return setText({font:a});
 if(k==='search'){ui.q=a;return A.nav({dataset:{v:'search'},closest:()=>null})}
}
function cmdRender(){
 const q=$('#cmdq')?$('#cmdq').value:'';cmdList=cmdItems(q);if(cmdSel>=cmdList.length)cmdSel=0;let g='';
 $('#cmdres').innerHTML=cmdList.map((it,i)=>{const hd=it.g!==g?`<div class="cmdg">${it.g}</div>`:'';g=it.g;return hd+`<button class="cmdr${i===cmdSel?' on':''}" data-act="cmdpick" data-i="${i}"><span class="ci">${ic(it.icon||'search',15)}</span><span class="cl">${esc(it.label)}</span>${it.sub?`<small>${esc(it.sub)}</small>`:''}</button>`}).join('');
 const on=$('#cmdres .cmdr.on');if(on&&on.scrollIntoView)on.scrollIntoView({block:'nearest'});
}
function openCmd(){
 const c=$('#cmd');if(!c)return;ui.spOpen=false;$('#fx').innerHTML=fxHtml();closeMenu();
 c.innerHTML=`<div class="cmdbox" role="dialog" aria-label="Command box"><div class="cmdq">${ic('search',18)}<input id="cmdq" placeholder="Go to, do or change anything…" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go"><button class="quiet" data-act="cmdclose">${MID.matches&&!('ontouchstart' in window)?'esc':'Cancel'}</button></div><div class="cmdres" id="cmdres"></div></div>`;
 c.classList.add('open');cmdSel=0;cmdRender();setTimeout(()=>{const i=$('#cmdq');if(i)i.focus()},30);
}
function closeCmd(){const c=$('#cmd');if(c){c.classList.remove('open');c.innerHTML=''}}
document.addEventListener('keydown',e=>{
 if((e.metaKey||e.ctrlKey)&&(e.key==='k'||e.key==='K')){e.preventDefault();$('#cmd.open')?closeCmd():openCmd();return}
 if(!$('#cmd.open'))return;
 if(e.key==='Escape'){e.preventDefault();closeCmd()}
 else if(e.key==='ArrowDown'){e.preventDefault();cmdSel=Math.min(cmdList.length-1,cmdSel+1);cmdRender()}
 else if(e.key==='ArrowUp'){e.preventDefault();cmdSel=Math.max(0,cmdSel-1);cmdRender()}
 else if(e.key==='Enter'){e.preventDefault();const it=cmdList[cmdSel];if(it)cmdRun(it)}
},true);
document.addEventListener('input',e=>{if(e.target.id==='cmdq'){cmdSel=0;cmdRender()}});
/* pull down on the page heading; long-press on the settings button */
(function(){let y0=null,t0=0,lp=null;
 document.addEventListener('touchstart',e=>{const t=e.touches[0];const bd=$('#body');if(e.target.closest('.phead,.dnav,.hgreetrow')&&bd&&bd.scrollTop<=0){y0=t.clientY;t0=Date.now()}else y0=null;
  if(e.target.closest('#fx .spb')){lp=setTimeout(()=>{lp=null;ui._cmdLP=Date.now();openCmd()},550)}},{passive:true});
 document.addEventListener('touchmove',e=>{if(y0==null)return;const dy=e.touches[0].clientY-y0;const tip=$('#pulltip');if(dy>30){if(!tip){const d=document.createElement('div');d.id='pulltip';d.textContent=dy>80?'Release for the command box':'↓ Pull for the command box';document.body.appendChild(d)}else tip.textContent=dy>80?'Release for the command box':'↓ Pull for the command box'}},{passive:true});
 document.addEventListener('touchend',e=>{if(lp){clearTimeout(lp);lp=null}const tip=$('#pulltip');if(tip)tip.remove();if(y0==null)return;const dy=e.changedTouches[0].clientY-y0;y0=null;if(dy>80)openCmd()},{passive:true});
})();

/* ---------- devotional: breadcrumb with nearby days ---------- */
function devNearby(st){const k=st.dev&&st.dev.date;if(!k)return {prev:null,next:null};const d=kdate(k),today=dkey(new Date());const shift=n=>{const x=new Date(d);x.setDate(x.getDate()+n);return dkey(x)};const pk=shift(-1),nk=shift(1);return {prev:devFor(pk)?pk:null,next:(nk<=today&&devFor(nk))?nk:null,pk,nk}}
function devNavHtml(st){
 const k=st.dev&&st.dev.date,d=kdate(k),n=devNearby(st);const day=x=>kdate(x).toLocaleDateString('en-US',{weekday:'short'});
 const dl=d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
 const days=MID.matches?`${n.prev?`<button data-act="devday" data-k="${n.prev}">${day(n.prev)}</button><span>·</span>`:''}<b>${d.toLocaleDateString('en-US',{weekday:'short'})}</b>${n.next?`<span>·</span><button data-act="devday" data-k="${n.next}">${day(n.next)}</button>`:''}`:`${n.prev?`<button data-act="devday" data-k="${n.prev}" aria-label="The day before">‹</button>`:''}${n.next?`<button data-act="devday" data-k="${n.next}" aria-label="The day after">›</button>`:''}`;
 return `<div class="dnav"><div class="dcrumb"><button data-act="dexit">${ic('sunrise',14)}Devotional</button><span class="sep">›</span><span>${esc(dl)}</span></div><div class="ddays">${days}</div></div>`;
}

window.MarginaliaState=S;window.MarginaliaTest={focus:()=>A.focus(),spill:()=>{if(!ui.spOpen)A.spill()},bstep:d=>A.bstep({dataset:{d:String(d)}}),shText:()=>shText(),selectWords,parseRef,verseMenu,state:()=>({sel:ui.sel,bar:ui.bar&&ui.bar.mode,edit:ui.edit,supp:suppressUntil-Date.now(),drag:!!ui.selDrag})};
/* ---------- start ---------- */
(async function start(){
 applyTheme();applyText();
 try{S.studies=(await DB.get('studies'))||{};S.pending=(await DB.get('pending'))||[];S.devo=(await DB.get('devo'))||{log:{}}}catch(e){}
 const first=studyList()[0];const last=LS.get('lastStudy',null);ui.sid=(last&&S.studies[last])?last:first?first.id:null;
 ui.view='home';
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
/* 1.6: the Bible's passage line */
document.addEventListener('input',e=>{if(e.target.id==='bq'||e.target.id==='sbq')autofill(e.target,e)});
document.addEventListener('keydown',e=>{const t=e.target;if((t.id==='bq'||t.id==='sbq')&&(e.key==='Tab'||e.key==='ArrowRight')&&t.selectionEnd===t.value.length&&t.selectionStart<t.selectionEnd){e.preventDefault();t.value=t.value+' ';t.setSelectionRange(t.value.length,t.value.length);autofill(t)}},true);
document.addEventListener('keydown',e=>{if(e.target.id==='sbq'&&e.key==='Enter'){e.preventDefault();const r=parseRef(e.target.value);if(!r){toast('Type a passage like Romans 8 or John 3:16');return}A.sbgo({dataset:{b:r.b,c:r.c1}});return}if(e.target.id!=='bq'||e.key!=='Enter')return;e.preventDefault();const r=parseRef(e.target.value);if(!r){toast('Type a passage like Romans 8 or John 3:16');return}A.bgo({dataset:{b:r.b,c:r.c1}});if(!r.whole&&r.v1>1)setTimeout(()=>{const el=document.getElementById(`bv-${r.b}-${r.c1}-${r.v1}`);if(el){el.scrollIntoView({block:'start'});const bd=$('#body');if(bd)bd.scrollTop-=70}},300)});
