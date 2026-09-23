let selected_element;
let tracking_element;
let lastdraggedelementparent;
let tracking;
let mouseXpos;
let mouseYpos;
let whichweaponslotishovering;
let whichinvslotishovering;

const GetItemJSON = async () => {
    try{
    const request = await fetch('singleinvitens.json');
    const response = await request.json();

    const data = response

    return data.itens;

    }
    catch(erro){
        console.log(` Erro: ${erro} impediu o precedimento continuar`);
        return undefined
    }
}

const GetAllWeaponsNames = async () => {
    const obj_json = await GetItemJSON();
    for(item_sector in obj_json){
        for(item in obj_json[item_sector]){
            console.log(item)
        }
    }
}

const GetWeaponWithName = async (weapon_name) => {
    if(!weapon_name) return
    let authentic_item;
    const Obj_JSON = await GetItemJSON();
    for(item_sector in Obj_JSON){
        for(item in Obj_JSON[item_sector]){
            for(item_prop in Obj_JSON[item_sector][item]){
                if(Obj_JSON[item_sector][item][item_prop] == weapon_name){
                    authentic_item = item;
                    return authentic_item;
                }
            }
        }
    }
    if(!authentic_item){
        console.log("Item não encontrado!"); return
    }
}  

const ClearAllSelectedElementsClass = () => {
    const elements = document.querySelectorAll(".global-inv-div")
    for(let i = 0; i < elements.length; i++){
        elements[i].classList.remove("targeted-element")
    }
}

const Unequip = async (weapon_slot) => {
    const w_img = weapon_slot.querySelector(".weapon-img-wrapper").querySelector(".weapon-img");
    w_img.src = "";
    w_img.style.display = "none";
    weapon_slot.querySelector(".data").dataset.weapon_name = "";
    weapon_slot.parentElement.classList.remove("weapon-filled");
}

const Equip = async (slot, weapon) => {
    let weapon_name;
    try{
        weapon_name = weapon.getElementsByClassName("item-name")[0].innerText;
        slot.querySelector(".weapon-wrapper").querySelector(".data").dataset.weapon_name = weapon.getElementsByClassName("item-name")[0].innerText;
    }
    catch(e){
        weapon_name = weapon.querySelector(".data").dataset.weapon_name;
        slot.querySelector(".weapon-wrapper").querySelector(".data").dataset.weapon_name = weapon.querySelector(".data").dataset.weapon_name;
        if(slot.querySelector(".weapon-wrapper") != weapon){
        Unequip(weapon);
        }
        if(!slot.classList.contains("weapon-filled")){
        slot.classList.add("weapon-filled");
        }
    }

    try{
        const object_json = await GetItemJSON();
        let Weapon;
        let webimage;

        for(item_sector in object_json){
            for(item in object_json[item_sector]){
                for(item_propertie in object_json[item_sector][item]){
                    if(object_json[item_sector][item][item_propertie] == weapon_name){
                        webimage = object_json[item_sector][item]["webimg"]
                        break
                    }
                }
                if(Weapon) break
            }
            if(Weapon) break
        }

        const img_slot = slot.querySelectorAll(".weapon-wrapper")[0].querySelectorAll(".weapon-img-wrapper")[0].querySelectorAll(".weapon-img")[0]
        img_slot.src = webimage;
        img_slot.style.display = "block";
        weapon.querySelectorAll(".item-name")[0].innerText = ""
        const item_img = weapon.querySelectorAll(".item-img-wrapper")[0].querySelectorAll(".item-img")[0];
        item_img.src = "";
        item_img.style.display = "none";
        weapon.querySelectorAll(".item-amount")[0].innerText = "";
        weapon.parentElement.classList.remove("filled-inv");
        weapon.parentElement.classList.add("empty-inv");
        slot.style.boxShadow = "none";
        slot.classList.add("weapon-filled");
    }
    catch(erro){
        console.log(`Erro ao procurar JSON na função "Equip()" ${erro}`)
    }
}

const Give = async (supposted_item, amount, to_slot) => {
    if(!supposted_item) return;
    if(!amount) amount = 1;

    let item_object = await GetItemJSON();
    let authentic_item;
    
    for(let item_sector in item_object){
        for(let item in item_object[item_sector]){
            if(item == supposted_item){
                authentic_item = item_object[item_sector][supposted_item];
                break;
            }
        }

        if(authentic_item){
            break;
        }
    }

    if(!authentic_item){
        console.log("item não encontrado")
        return
    }

    if(to_slot != undefined){
        if(isNaN(parseFloat(to_slot))){
            try{
                throw new Error("O terceiro argumento DEVE ser um número válido")
            }
            catch(e){
                console.error(e.message)
                return
            }
            
        }
    }

    if(to_slot != undefined){
        const element = document.querySelectorAll(".classinv-slot")[to_slot]
        if(element.classList.contains("empty-inv")){
            element.classList.replace("empty-inv", "filled-inv")
                let global_div = element.getElementsByClassName("global-inv-div")[0];
                let item_name = global_div.getElementsByClassName("item-name")[0];
                let item_img = global_div.getElementsByClassName("item-img-wrapper")[0].getElementsByClassName("item-img")[0];
                let item_amount = global_div.getElementsByClassName("item-amount")[0];
                item_img.style.display = "block";
                item_name.innerText = authentic_item.name;
                item_img.src = `${authentic_item.webimg}`
                item_amount.innerText = amount+"x";
                return
        }
    }

    const arr = document.querySelectorAll(".classinv-slot"); 

    for (let i = 0; i < arr.length; i++) {
        let element = arr[i];
            if(element.classList.contains("empty-inv")){
                element.classList.replace("empty-inv", "filled-inv")
                let global_div = element.getElementsByClassName("global-inv-div")[0];
                let item_name = global_div.getElementsByClassName("item-name")[0];
                let item_img = global_div.getElementsByClassName("item-img-wrapper")[0].getElementsByClassName("item-img")[0];
                let item_amount = global_div.getElementsByClassName("item-amount")[0];
                item_img.style.display = "block";
                item_name.innerText = authentic_item.name;
                item_img.src = `${authentic_item.webimg}`
                item_amount.innerText = amount+"x";
                break
            }
    }
}

const CleanSlot = (slot) => {
    let g_div;
    if(slot.classList.contains("global-inv-div")){
        g_div = slot
    }
    else if(slot.classList.contains("classinv-slot")){
        g_div = slot.querySelector(".global-inv-div")
    }
    if(!g_div)return;
    g_div.parentElement.classList.remove("filled-inv")
    g_div.parentElement.classList.add("empty-inv")
    g_div.querySelector(".item-name").innerText = "";
    g_div.querySelector(".item-amount").innerText = "";
    g_div.querySelector(".item-img-wrapper").querySelector(".item-img").src = "";
    g_div.querySelector(".item-img-wrapper").querySelector(".item-img").style.display = "none";
}

document.addEventListener("mousedown", (e) => {
    let bypass;
    if(e.button == 2)return
    if(e.target.parentElement.classList.contains("weapon-filled")) bypass = 1;
    if((!e.target.classList.contains("global-inv-div") || !e.target.parentElement.classList.contains("filled-inv")) && !bypass){return;}
    if(bypass) bypass = undefined;
    tracking_element = e.target;
    lastdraggedelementparent = tracking_element.parentElement;
    tracking = true
    const elemt_width = tracking_element.getBoundingClientRect().width;
    const elemt_height = tracking_element.getBoundingClientRect().height;
    document.body.appendChild(tracking_element)
    mouseXpos = e.clientX;
    mouseYpos = e.clientY;
    tracking_element.style.pointerEvents = "none";
    tracking_element.style.left = e.clientX+"px";
    tracking_element.style.top = e.clientY+"px"; 
    tracking_element.style.transition = "0s";
    tracking_element.style.position = "absolute";
    tracking_element.style.width = elemt_width+"px";
    tracking_element.style.height = elemt_height+"px";
    tracking_element.style.transform = "translate(-50%,-50%)";
    tracking_element.style.opacity = "60%";
})

document.addEventListener("mouseup", async (e) => {
    if(e.button == 2)return
    if(!tracking_element){return;}
    tracking = false;
    lastdraggedelementparent.appendChild(tracking_element)
    tracking_element.style.width = "100%";
    tracking_element.style.height =  "100%";
    tracking_element.style.transition = "0.25s";
    tracking_element.style.pointerEvents = "all";
    tracking_element.style.position = "relative";
    tracking_element.style.left = mouseXpos;
    tracking_element.style.top = mouseYpos;
    tracking_element.style.transform = "translate(0,0)";
    tracking_element.style.opacity = "100%";
    if(whichinvslotishovering && whichinvslotishovering.parentElement.classList.contains("empty-inv")){
        let item;
        try{
            item = await GetWeaponWithName(tracking_element.querySelector(".data").dataset.weapon_name);
            if(tracking_element.parentElement.classList.contains("weapon-filled")){
                tracking_element.parentElement.classList.remove("weapon-filled");
                tracking_element.querySelector(".weapon-img-wrapper").querySelector(".weapon-img").src = "";
                tracking_element.querySelector(".weapon-img-wrapper").querySelector(".weapon-img").style.display = "none";
                tracking_element.querySelector(".ammo-amount").innerText = "";
                tracking_element.querySelector(".data").dataset.weapon_name = "";
            }
        }
        catch(e){
            item = await GetWeaponWithName(tracking_element.querySelector(".item-name").innerText)
        }
        const g_div = document.querySelectorAll(".global-inv-div")
        let aut_inv;
        for(i = 0; i < g_div.length; i++){
            if(g_div[i] == whichinvslotishovering){
                aut_inv = i;
            }
        }
        try{
          whichinvslotishovering.style.boxShadow = "none";  
        }
        catch(e){
            console.error(`incapaz de definir box-shadow devido ao erro:${e.message}`)
        }

        if(aut_inv == undefined){
            tracking = false;
            tracking_element.style.top = "0";
            tracking_element.style.left = "0";
            tracking_element = undefined;
            lastdraggedelementparent = undefined;
            
            return;
        }
        Give(item, 1, aut_inv)
        tracking = false;
        tracking_element.style.top = "0";
        tracking_element.style.left = "0";
        CleanSlot(tracking_element);
        tracking_element = undefined;
        lastdraggedelementparent = undefined;
        whichinvslotishovering = undefined
    }
    if(whichweaponslotishovering){
        Equip(whichweaponslotishovering, tracking_element)
        tracking = false;
        tracking_element.style.top = "0";
        tracking_element.style.left = "0";
        tracking_element = undefined;
        lastdraggedelementparent = undefined;
        whichweaponslotishovering = undefined
    }
    if(!whichinvslotishovering && !whichweaponslotishovering){
        tracking = false;
        try{
            tracking_element.style.top = "0";
            tracking_element.style.left = "0";
        }
        catch{//not null
        }
        tracking_element = undefined;
        lastdraggedelementparent = undefined;
    }
})

document.addEventListener("mousemove", (e) => {
        if(!tracking) return;
        mouseXpos = e.clientX;
        mouseYpos = e.clientY;
        tracking_element.style.top = e.clientY+"px";
        tracking_element.style.left = e.clientX+"px";
    })

document.addEventListener("contextmenu", (e) => {
    if(e.target == document.body) return;
    e.preventDefault();
})

document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".classinv-slot")
    
    const BindSelectionItems = () => {
        const global_inv_elements = document.querySelectorAll(".global-inv-div") 
        for(let i = 0; i < global_inv_elements.length; i++){
            global_inv_elements[i].addEventListener("mousedown", (e) => {
                if(e.button != 2) return;
                if(global_inv_elements[i].parentElement.classList.contains("empty-inv")) return;
                if(!e.target.classList.contains("global-inv-div")) return;

                if(global_inv_elements[i].classList.contains("targeted-element")){
                    global_inv_elements[i].classList.remove("targeted-element")
                }
                else{
                    ClearAllSelectedElementsClass()
                    global_inv_elements[i].classList.add("targeted-element")
                    selected_element = global_inv_elements[i]
                }
                
            })
        }
    }

    elements.forEach((element) => {
        element.classList.add("empty-inv")
        const newdiv = document.createElement("div");
        newdiv.classList.add("global-inv-div");
        element.appendChild(newdiv);
        const item_name = document.createElement("h3");
        item_name.classList.add("item-name");
        newdiv.appendChild(item_name);
        const item_img_wrapper = document.createElement("div");
        item_img_wrapper.classList.add("item-img-wrapper");
        newdiv.appendChild(item_img_wrapper);
        const item_img = document.createElement("img")
        item_img.classList.add("item-img")
        item_img_wrapper.appendChild(item_img)
        const item_amount = document.createElement("h3");
        item_amount.classList.add("item-amount")
        newdiv.appendChild(item_amount)
        });

    BindSelectionItems()

    const armor_slots = document.querySelectorAll(".armor-slot")
    for(let i = 0; i < armor_slots.length; i++){
        armor_slots[i].addEventListener("mouseover", () => {
            if(armor_slots[i].classList.contains("weapon-filled")) return;
            if(!tracking) return;
            whichweaponslotishovering = armor_slots[i];
            armor_slots[i].style.boxShadow = "0 0 4px 4px rgb(189, 188, 188)";
        })
        armor_slots[i].addEventListener("mouseout", () => {
            armor_slots[i].style.boxShadow = "none";
            whichweaponslotishovering = undefined;
        })
    }
    const inv_slots = document.querySelectorAll(".classinv-slot")

    for(i = 0; i < inv_slots.length; i++){
        let global_elemnt = inv_slots[i].querySelector(".global-inv-div");
        global_elemnt.addEventListener("mouseover", () => {
            if(!global_elemnt.parentElement.classList.contains("empty-inv")) return;
            if(!tracking) return;
            whichinvslotishovering = global_elemnt;
            global_elemnt.style.boxShadow = "0 0 4px 4px rgb(189, 188, 188)"
        })
        global_elemnt.addEventListener("mouseout", () => {
            whichinvslotishovering = undefined;
            global_elemnt.style.boxShadow = "none"
        })
    }
})
