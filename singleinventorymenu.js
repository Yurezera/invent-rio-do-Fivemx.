let selected_element;
let tracking_element;
let lastdraggedelementparent;
let tracking;
let mouseXpos;
let mouseYpos;
let whichweaponslotishovering;
let whichinvslotishovering;
let whichinvslotishovering_else;
let widthandheight;

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

const ExcludeXOnEnd = (text_which_has_x_with_last_char) => {
    if(typeof text_which_has_x_with_last_char != typeof ""){
        text_which_has_x_with_last_char = text_which_has_x_with_last_char.toString();
    }
        if(text_which_has_x_with_last_char.endsWith("x")){
            let formatted_string = [];
            let string = "";
            for(i=0;i<text_which_has_x_with_last_char.length-1;i++){
                formatted_string.push(text_which_has_x_with_last_char[i])
            }
            for(i=0;i<formatted_string.length;i++){
                string = string + formatted_string[i]
            }
            formatted_string = string;
            return formatted_string
        }
}

const ResizeTextElements = () => {
    const h2_texts = document.querySelectorAll("h2");
    const h1_texts = document.querySelectorAll("h1");
    const [h3_texts, span_texts] = [document.querySelectorAll("h3"), document.querySelectorAll("span")]
    const p_texts = document.querySelectorAll("p");
    const inp_texts = document.querySelectorAll("input");
    for(i=0; i<h2_texts.length;i++){
        h2_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*3.5)+"px";
    }
    for(i=0;i<h1_texts.length; i++){
        h1_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*2.5)+"px";
    }
    for(i=0;i<p_texts.length;i++){
        p_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*3.35)+"px";
    }
    for(i=0;i<inp_texts.length;i++){
        inp_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*4.15)+"px";
    }
    for(i=0;i<h3_texts.length;i++){
        h3_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*4.65)+"px";
    }
    for(i=0;i<span_texts.length;i++){
        span_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*4.65)+"px";
    }
}

const RefreshWAndH = () => {
    const vp_width = window.innerWidth;
    const vp_height = window.innerHeight;
    widthandheight = vp_height+vp_width;
    return widthandheight;
}

const ClearAllSelectedElementsClass = () => {
    const elements = document.querySelectorAll(".global-inv-div")
    for(let i = 0; i < elements.length; i++){
        elements[i].classList.remove("targeted-element")
        if(elements[i].style.boxShadow != "none"){
            elements[i].style.boxShadow = "none";
        }
    }
}

const BindSelectionItems = () => {
    const global_inv_elements = document.querySelectorAll(".global-inv-div") 
    for(let i = 0; i < global_inv_elements.length; i++){
        global_inv_elements[i].addEventListener("mousedown", (e) => {
            if(global_inv_elements[i].parentElement.classList.contains("empty-inv")){return;}
            if(e.button != 2) return;
            if(!e.target.classList.contains("global-inv-div")) return;

            if(global_inv_elements[i].classList.contains("targeted-element")){
                global_inv_elements[i].style.boxShadow = "none";
                global_inv_elements[i].classList.remove("targeted-element");
                selected_element = undefined;
            }
            else{
                ClearAllSelectedElementsClass();
                global_inv_elements[i].classList.add("targeted-element");
                global_inv_elements[i].style.boxShadow = "0 0 30px rgb(255,255,255)";
                selected_element = global_inv_elements[i];
            }
                
        })
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

const DoesItemExist = async (item) => {
    const obj_json = await GetItemJSON();

    for(item_sector in obj_json){
        for(it in obj_json[item_sector]){
            if(it == item){
                return true;
            }
        }
    }
    return false;
}
 
const GetWeaponWithName = async (weapon_name) => {
    if(!weapon_name) return
    let authentic_item;
    const Obj_JSON = await GetItemJSON();
    for(item_sector in Obj_JSON){
        for(item in Obj_JSON[item_sector]){
            for(item_prop in Obj_JSON[item_sector][item]){
                if(Obj_JSON[item_sector][item]["name"] == weapon_name){
                    authentic_item = item;
                    return authentic_item;
                }
            }
        }
    }
    if(!authentic_item){
        console.log("Item não encontrado!"); return undefined;
    }
}  

const GetWeaponSectorWithName = async (weapon_name) => {
    if(!weapon_name) return
    let authentic_item;
    const Obj_JSON = await GetItemJSON();
    for(item_sector in Obj_JSON){
        for(item in Obj_JSON[item_sector]){
            for(item_prop in Obj_JSON[item_sector][item]){
                if(Obj_JSON[item_sector][item]["name"] == weapon_name){
                    authentic_item = item;
                    return item_sector;
                }
            }
        }
    }
    if(!authentic_item){
        console.log("Item Sector não encontrado!"); return undefined;
    }
}  

const GetWeaponHashWithName = async (weapon_name) => {
    const obj_json = await GetItemJSON();
    for(item_sector in obj_json){
        for(item in obj_json[item_sector]){
            if(obj_json[item_sector][item]["name"] == weapon_name){
                return obj_json[item_sector][item]["hash"]
            }
        }
    }
}

const Unequip = async (weapon_slot) => {
    console.log("unequiped!")
    const w_img = weapon_slot.querySelector(".weapon-img-wrapper").querySelector(".weapon-img");
    w_img.src = "";
    w_img.style.display = "none";
    weapon_slot.querySelector(".data").dataset.weapon_name = "";
    weapon_slot.querySelector(".ammo-amount").innerText = "";
    weapon_slot.parentElement.classList.remove("weapon-filled");
}

const Equip = async (slot, weapon) => {
    let weapon_name;
    let ammo_amnt;
    try{
        weapon_name = weapon.getElementsByClassName("item-name")[0].innerText;
        slot.querySelector(".weapon-wrapper").querySelector(".data").dataset.weapon_name = weapon.getElementsByClassName("item-name")[0].innerText;
    }
    catch(e){
        weapon_name = weapon.querySelector(".data").dataset.weapon_name;
        slot.querySelector(".weapon-wrapper").querySelector(".data").dataset.weapon_name = weapon.querySelector(".data").dataset.weapon_name;
        if(slot.querySelector(".weapon-wrapper") != weapon){
            ammo_amnt = weapon.querySelector(".ammo-amount").innerText;
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

        ClearAllSelectedElementsClass()
        selected_element = undefined;

        const img_slot = slot.querySelectorAll(".weapon-wrapper")[0].querySelectorAll(".weapon-img-wrapper")[0].querySelectorAll(".weapon-img")[0]
        if(ammo_amnt){
            slot.querySelector(".weapon-wrapper").querySelector(".ammo-amount").innerText = ammo_amnt;
        }
        img_slot.src = webimage;
        img_slot.style.display = "block";
        weapon.querySelectorAll(".item-name")[0].innerText = "";
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
        console.log("Por incrível que pareça, esse erro pode ser benigno")
    }
}

const Give = async (supposted_item, amount, to_slot, can_sum_with_same_item = true) => {
    if(!supposted_item) return;
    if(!amount) amount = 1;

    if(amount.toString().endsWith("x")){
        let formatted_string = [];
        let string = "";
        for(i=0;i<amount.length-1;i++){
            formatted_string.push(amount[i])
        }
        for(i=0;i<formatted_string.length;i++){
            string = string + formatted_string[i]
        }
        amount = string;
    }

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

    ClearAllSelectedElementsClass();
    selected_element = undefined;

    ResizeTextElements()

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
        const item_json = await GetItemJSON();
        let item_max_amm;
        const item_current_amm_on_inv = parseInt(ExcludeXOnEnd(arr[i].querySelector(".item-amount").innerText));
        for(item_sector in item_json){
            for(item in item_json[item_sector]){
                if(item_json[item_sector][item]["name"] == authentic_item["name"]){
                    item_max_amm = item_json[item_sector][item]["stack_limit"];
                    break;
                }
            }
            if(item_max_amm) break;
        }
        if(element.classList.contains("empty-inv") && amount <= parseInt(item_max_amm)){
            element.classList.replace("empty-inv", "filled-inv");
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
        else if(element.classList.contains("empty-inv") && amount > parseInt(item_max_amm)){
            let resto = amount;
            element.classList.replace("empty-inv", "filled-inv");
            let global_div = element.getElementsByClassName("global-inv-div")[0];
            let item_name = global_div.getElementsByClassName("item-name")[0];
            let item_img = global_div.getElementsByClassName("item-img-wrapper")[0].getElementsByClassName("item-img")[0];
            let item_amount = global_div.getElementsByClassName("item-amount")[0];
            item_img.style.display = "block";
            item_name.innerText = authentic_item.name;
            item_img.src = `${authentic_item.webimg}`
            item_amount.innerText = item_max_amm+"x";
            resto = resto - parseInt(item_max_amm);
            let l = 1;
            while(resto > 0){
                element = arr[i+l];
                element.classList.replace("empty-inv", "filled-inv");
                let global_div = element.getElementsByClassName("global-inv-div")[0];
                let item_name = global_div.getElementsByClassName("item-name")[0];
                let item_img = global_div.getElementsByClassName("item-img-wrapper")[0].getElementsByClassName("item-img")[0];
                let item_amount = global_div.getElementsByClassName("item-amount")[0];
                item_img.style.display = "block";
                item_name.innerText = authentic_item.name;
                item_img.src = `${authentic_item.webimg}`
                if(resto > item_max_amm){
                    item_amount.innerText = item_max_amm+"x";
                    resto = resto - parseInt(item_max_amm);
                }
                else{
                    item_amount.innerText = resto+"x";
                    resto = resto - resto; 
                } 
                l += 1;
            }
            break;
        }
            //escopo que soma com o item que ja tem!
        else if(element.classList.contains("filled-inv") && authentic_item["name"] == arr[i].querySelector(".global-inv-div").querySelector(".item-name").innerText && can_sum_with_same_item){
            console.log(5)
            for(item_sector in item_object){
                for(item in item_object[item_sector]){
                    if(item_json[item_sector][item]["name"] == authentic_item["name"]){
                        item_max_amm = item_json[item_sector][item]["stack_limit"];
                        break;
                    }
                }
                if(item_max_amm) break;
            }
            if(amount + item_current_amm_on_inv > parseInt(item_max_amm) && parseInt(ExcludeXOnEnd(arr[i].querySelector(".global-inv-div").querySelector(".item-amount").innerText)) != parseInt(item_max_amm)){
                const difference = parseInt(item_max_amm) - item_current_amm_on_inv;
                let resto;
                switch(true){
                    case(amount >= difference):
                        resto = amount - difference;
                        break;
                    case(difference > amount):
                        resto = difference - amount;
                        break;
                }
                arr[i].querySelector(".global-inv-div").querySelector(".item-amount").innerText = (parseInt(ExcludeXOnEnd(arr[i].querySelector(".global-inv-div").querySelector(".item-amount").textContent)) + difference)+"x";
                let j = 1;
                while(resto>0){
                    let all_rest = resto;
                    element = arr[i+j];
                    if(!element){
                        return;
                    }
                    if(element.classList.contains("filled-inv")){
                        for(let k = 0; k<20; k++){
                            if(arr[k].classList.contains("empty-inv")){
                                element = arr[k];
                                break;
                            }
                        }
                    }
                    element.classList.replace("empty-inv", "filled-inv")
                    let global_div = element.getElementsByClassName("global-inv-div")[0];
                    let item_name = global_div.getElementsByClassName("item-name")[0];
                    let item_img = global_div.getElementsByClassName("item-img-wrapper")[0].getElementsByClassName("item-img")[0];
                    let item_amount = global_div.getElementsByClassName("item-amount")[0];
                    item_img.style.display = "block";
                    item_name.innerText = authentic_item.name;
                    item_img.src = `${authentic_item.webimg}`
                    if(resto > item_max_amm){
                        item_amount.innerText = parseInt(item_max_amm)+"x";
                        resto = resto - parseInt(item_max_amm);
                    }
                    else{
                        item_amount.innerText = resto+"x";
                        resto = resto - resto;
                    }
                    //aqui!!
                    j +=1;
                }
                break;
            }
            else{
                if(parseInt(ExcludeXOnEnd(arr[i].querySelector(".global-inv-div").querySelector(".item-amount").innerText)) != parseInt(item_max_amm)){
                    arr[i].querySelector(".global-inv-div").querySelector(".item-amount").innerText = (parseInt(ExcludeXOnEnd(arr[i].querySelector(".global-inv-div").querySelector(".item-amount").textContent)) + amount)+"x";
                    break;
                }
            }
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

    if(whichinvslotishovering_else && tracking_element.parentElement.classList.contains("classinv-slot")){
        if(!whichweaponslotishovering){
            if(whichinvslotishovering_else.querySelector(".item-name").innerText == tracking_element.querySelector(".item-name").innerText){
                if(whichinvslotishovering_else != tracking_element){
                    //mexendo com o mesmo elemento, mas com handlers diferentes(são diferentes slots)

                    const item_json = await GetItemJSON();
                    let item_max_amm;
                    for(item_sector in item_json){
                        for(item in item_json[item_sector]){
                            if(item_json[item_sector][item]["name"] == whichinvslotishovering_else.querySelector(".item-name").innerText){
                                item_max_amm = item_json[item_sector][item]["stack_limit"];
                                item_max_amm = parseInt(item_max_amm);
                                break;
                            }
                        }
                    if(item_max_amm) break;
                    }

                    if(item_max_amm){
                        if((parseInt(ExcludeXOnEnd(whichinvslotishovering_else.querySelector(".item-amount").innerText)) + parseInt(ExcludeXOnEnd(tracking_element.querySelector(".item-amount").innerText))) <= item_max_amm){
                            whichinvslotishovering_else.querySelector(".item-amount").innerText = (parseInt(ExcludeXOnEnd(whichinvslotishovering_else.querySelector(".item-amount").innerText)) + parseInt(ExcludeXOnEnd(tracking_element.querySelector(".item-amount").innerText)))+"x";
                            tracking_element.querySelector(".item-amount").innerText = (parseInt(ExcludeXOnEnd(tracking_element.querySelector(".item-amount").innerText)) - parseInt(ExcludeXOnEnd(tracking_element.querySelector(".item-amount").innerText)))+"x";
                        }
                        else{
                            const diferença = item_max_amm - parseInt(ExcludeXOnEnd(whichinvslotishovering_else.querySelector(".item-amount").innerText))
                            whichinvslotishovering_else.querySelector(".item-amount").innerText = (parseInt(ExcludeXOnEnd(whichinvslotishovering_else.querySelector(".item-amount").innerText)) + diferença)+"x";
                            tracking_element.querySelector(".item-amount").innerText = (parseInt(ExcludeXOnEnd(tracking_element.querySelector(".item-amount").innerText)) - diferença)+"x";
                        }
                    }

                    if(parseInt(ExcludeXOnEnd(tracking_element.querySelector(".item-amount").innerText)) <= 0 ){
                        CleanSlot(tracking_element);
                    }

                    tracking = false;
                    tracking_element.style.top = "0";
                    tracking_element.style.left = "0";
                    tracking_element = undefined;
                    lastdraggedelementparent = undefined;
                    whichinvslotishovering_else = undefined;
                }
            }
        }
    }

    try{
        //Equip Ammo
        if(e.target.classList.contains("weapon-wrapper") && e.target.parentElement.classList.contains("weapon-filled") && await GetWeaponSectorWithName(e.target.querySelector(".data").dataset.weapon_name) == "armas"){
            const ammo_type = await GetWeaponWithName(tracking_element.querySelector(".item-name").innerText);
            const w = await GetWeaponWithName(e.target.querySelector(".data").dataset.weapon_name);
            const obj_json = await GetItemJSON()
            let pass;
            for(item_sector in obj_json){
                for(item in obj_json[item_sector]){
                    for(item_prop in obj_json[item_sector][item]){
                        if(item_prop == "ammo_type"){
                            if(obj_json[item_sector][w]["ammo_type"] == ammo_type && item == w){
                                let current_ammo_equipped;
                                if(e.target.querySelector(".ammo-amount").innerText.endsWith("x")){
                                    current_ammo_equipped = parseInt(ExcludeXOnEnd(e.target.querySelector(".ammo-amount").innerText));
                                }
                                if(!document.querySelector("#amount-inp").value){
                                    if(current_ammo_equipped){
                                        e.target.querySelector(".ammo-amount").innerText = (current_ammo_equipped + parseInt(ExcludeXOnEnd(tracking_element.querySelector(".item-amount").innerText)))+"x";
                                        CleanSlot(tracking_element);
                                    }
                                    else{
                                        e.target.querySelector(".ammo-amount").innerText = tracking_element.querySelector(".item-amount").innerText;
                                        CleanSlot(tracking_element);
                                    }
                                }
                                else{
                                    let ammo_requisited = document.querySelector("#amount-inp").value;
                                    let formatted_ammo;
                                    if(tracking_element.querySelector(".item-amount").innerText.toString().endsWith("x")){
                                        let formatted_string = [];
                                        let string = "";
                                        for(i=0;i<tracking_element.querySelector(".item-amount").innerText.length-1;i++){
                                            formatted_string.push(tracking_element.querySelector(".item-amount").innerText[i])
                                        }
                                        for(i=0;i<formatted_string.length;i++){
                                            string = string + formatted_string[i]
                                        }
                                        formatted_string = string;
                                        formatted_ammo = formatted_string;
                                    }

                                    if(parseInt(document.querySelector("#amount-inp").value) > parseInt(formatted_ammo)){
                                        if(document.querySelector("#amount-inp").value){
                                            if(current_ammo_equipped){
                                                e.target.querySelector(".ammo-amount").innerText = (current_ammo_equipped + parseInt(ExcludeXOnEnd(tracking_element.querySelector(".item-amount").innerText)))+"x";
                                                CleanSlot(tracking_element);
                                            }
                                            else{
                                                e.target.querySelector(".ammo-amount").innerText = tracking_element.querySelector(".item-amount").innerText;
                                                CleanSlot(tracking_element);
                                            }
                                        }   
                                    }
                                    else{
                                        const item_amm = ExcludeXOnEnd(tracking_element.querySelector(".item-amount").innerText);
                                        if(current_ammo_equipped){
                                            e.target.querySelector(".ammo-amount").innerText = (parseInt(ammo_requisited)+current_ammo_equipped)+"x";
                                        }
                                        else{
                                            e.target.querySelector(".ammo-amount").innerText = (ammo_requisited)+"x";
                                        }
                                        
                                        if((item_amm-ammo_requisited) == 0){
                                            CleanSlot(tracking_element);
                                        }
                                        else{
                                            tracking_element.querySelector(".item-amount").innerText = (item_amm-ammo_requisited)+"x";  
                                        }
                                        
                                    }
                                }
                                console.log("Essa arma aceita esse tipo de munição!")
                            }
                        }
                    }
                }
            }
        }
    }
    catch(error){
        console.log(error)

    }
    if(e.target.classList.contains("unequip-div") && e.target.parentElement.id == "unequip" && tracking_element.classList.contains("weapon-wrapper")){
        const w = await GetWeaponWithName(tracking_element.querySelector(".data").dataset.weapon_name);
        const obj_json = await GetItemJSON();
        let ammo_type;
        let ammo_amount;
        for(item_sector in obj_json){
            for(item in obj_json[item_sector]){
                if(w == item){
                    ammo_type = obj_json[item_sector][item]["ammo_type"];
                    console.log(ammo_type)
                }
            }
        }
        if(tracking_element.querySelector(".ammo-amount") != "" || tracking_element.querySelector(".ammo-amount") != undefined){
            if(ammo_type){
            ammo_amount = parseInt(ExcludeXOnEnd(tracking_element.querySelector(".ammo-amount").innerText));
            }
        }
        if(ammo_amount){
            Give(ammo_type, ammo_amount);
            tracking_element.classList.remove("weapon-filled");
            tracking_element.querySelector(".weapon-img-wrapper").querySelector(".weapon-img").src = "";
            tracking_element.querySelector(".weapon-img-wrapper").querySelector(".weapon-img").style.display = "none";
            tracking_element.querySelector(".ammo-amount").innerText = "";
            tracking_element.querySelector(".data").dataset.weapon_name = "";
        }
        Give(w)
        Unequip(tracking_element)
        tracking = false;
        tracking_element.style.top = "0";
        tracking_element.style.left = "0";
        tracking_element = undefined;
        lastdraggedelementparent = undefined;
        return
    }
    if(whichinvslotishovering && whichinvslotishovering.parentElement.classList.contains("empty-inv")){
        let item;
        let item_amnt;
        let ammo_type_equipped;
        let weapon_has_ammo_equipped;
        let weapon_ammo;
        try{
            //Se for trocado de slot de arma SOMENTE
            item = await GetWeaponWithName(tracking_element.querySelector(".data").dataset.weapon_name);
            if(tracking_element.parentElement.classList.contains("weapon-filled")){
                //aqui vai a função que limpa o inv do player
                const obj_json = await GetItemJSON();
                const w_selected = await GetWeaponWithName(tracking_element.querySelector(".data").dataset.weapon_name);
                let am_type;
                for(item_sector in obj_json){
                    for(weap in obj_json[item_sector]){
                        if(weap == w_selected){
                            am_type = obj_json[item_sector][weap]["ammo_type"];
                            ammo_type_equipped = am_type;
                            break
                        }
                    }
                if(am_type)break
                }
                if(tracking_element.querySelector(".ammo-amount").innerText != ""){
                    weapon_has_ammo_equipped = true;
                    weapon_ammo = parseInt(ExcludeXOnEnd(tracking_element.querySelector(".ammo-amount").innerText));
                }
                tracking_element.parentElement.classList.remove("weapon-filled");
                tracking_element.querySelector(".weapon-img-wrapper").querySelector(".weapon-img").src = "";
                tracking_element.querySelector(".weapon-img-wrapper").querySelector(".weapon-img").style.display = "none";
                tracking_element.querySelector(".ammo-amount").innerText = "";
                tracking_element.querySelector(".data").dataset.weapon_name = "";
            }
        }
        catch(e){
            item = await GetWeaponWithName(tracking_element.querySelector(".item-name").innerText)
            item_amnt = tracking_element.querySelector(".item-amount").innerText;
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
        Give(item, item_amnt, aut_inv)
        if(weapon_has_ammo_equipped){
            Give(ammo_type_equipped, weapon_ammo)
        }
        tracking = false;
        tracking_element.style.top = "0";
        tracking_element.style.left = "0";
        CleanSlot(tracking_element);
        tracking_element = undefined;
        lastdraggedelementparent = undefined;
        whichinvslotishovering = undefined
    }
    if(whichweaponslotishovering){
        //implementar essa parte no fivem!
        try{
            if(parseInt(ExcludeXOnEnd(tracking_element.querySelector(".item-amount").innerText)) > 1){
                Give(await GetWeaponWithName(tracking_element.querySelector(".item-name").innerText), parseInt(ExcludeXOnEnd(tracking_element.querySelector(".item-amount").innerText)) - 1)
            }
        }
        catch(err){
            console.log(err)
        }
        //
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

document.querySelector("#unequip-all").addEventListener("click", async () => {
    const armors_slots = document.querySelectorAll(".armor-slot");
    for(let i = 0 ;i < armors_slots.length; i++){
        if(armors_slots[i].classList.contains("weapon-filled")){
            let weapon = await GetWeaponWithName(armors_slots[i].querySelector(".data").dataset.weapon_name);
            const obj_json = await GetItemJSON();
            let ammo_type;
            for(item_sector in obj_json){
                for(item in obj_json[item_sector]){
                    if(item == weapon){
                        ammo_type = obj_json[item_sector][weapon]["ammo_type"];
                    }
                    
                }
            }
            let ammo_amount;
            if(armors_slots[i].querySelector(".weapon-wrapper").querySelector(".ammo-amount").innerText != undefined || armors_slots[i].querySelector(".weapon-wrapper").querySelector(".ammo-amount").innerText != ""){
                ammo_amount = parseInt(ExcludeXOnEnd(armors_slots[i].querySelector(".weapon-wrapper").querySelector(".ammo-amount").innerText));
            }
            Give(weapon);
            if(ammo_amount){
                Give(ammo_type, ammo_amount)
                armors_slots[i].classList.remove("weapon-filled");
                armors_slots[i].querySelector(".weapon-wrapper").querySelector(".weapon-img-wrapper").querySelector(".weapon-img").src = "";
                armors_slots[i].querySelector(".weapon-wrapper").querySelector(".weapon-img-wrapper").querySelector(".weapon-img").style.display = "none";
                armors_slots[i].querySelector(".weapon-wrapper").querySelector(".ammo-amount").innerText = "";
                armors_slots[i].querySelector(".weapon-wrapper").querySelector(".data").dataset.weapon_name = "";
            }
            Unequip(armors_slots[i].querySelector(".weapon-wrapper"))
        }
    }
})

document.querySelector("#usar").addEventListener("click", () => {
    //usou item
    console.log("usou: ",selected_element)
})

document.addEventListener("DOMContentLoaded", () => {
    const h2_texts = document.querySelectorAll("h2");
    const h1_texts = document.querySelectorAll("h1");
    const [h3_texts, span_texts] = [document.querySelectorAll("h3"), document.querySelectorAll("span")]
    const p_texts = document.querySelectorAll("p");
    const inp_texts = document.querySelectorAll("input");
    for(i=0; i<h2_texts.length;i++){
        //console.log(RefreshWAndH()**-1.2*10000)
        h2_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*3.5)+"px";
    }
    for(i=0;i<h1_texts.length; i++){
        h1_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*2.5)+"px";
    }
    for(i=0;i<p_texts.length;i++){
        p_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*3.35)+"px";
    }
    for(i=0;i<inp_texts.length;i++){
        inp_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*4.15)+"px";
    }
    for(i=0;i<h3_texts.length;i++){
        h3_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*4.65)+"px";
    }
    for(i=0;i<span_texts.length;i++){
        span_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*4.65)+"px";
    }

    const elements = document.querySelectorAll(".classinv-slot")

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

    BindSelectionItems();    

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
            if(!global_elemnt.parentElement.classList.contains("empty-inv")) return;
            if(!tracking) return;
            whichinvslotishovering = undefined;
            global_elemnt.style.boxShadow = "none"
        })
    }
    for(i = 0; i < inv_slots.length; i++){
        let global_elemnt = inv_slots[i].querySelector(".global-inv-div");
        global_elemnt.addEventListener("mouseover", () => {
            if(!tracking) return;
            whichinvslotishovering_else = global_elemnt;
        })
        global_elemnt.addEventListener("mouseout", () => {
            if(!tracking) return;
            whichinvslotishovering_else = undefined;
        })
    }
})

window.addEventListener("resize", (e) => {
    const h2_texts = document.querySelectorAll("h2");
    const h1_texts = document.querySelectorAll("h1");
    const [h3_texts, span_texts] = [document.querySelectorAll("h3"), document.querySelectorAll("span")]
    const p_texts = document.querySelectorAll("p");
    const inp_texts = document.querySelectorAll("input");
    for(i=0; i<h2_texts.length;i++){
        //console.log(RefreshWAndH()**-1.2*10000)
        h2_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*3.5)+"px";
    }
    for(i=0;i<h1_texts.length; i++){
        h1_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*2.5)+"px";
    }
    for(i=0;i<p_texts.length;i++){
        p_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*3.35)+"px";
    }
    for(i=0;i<inp_texts.length;i++){
        inp_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*4.15)+"px";
    }
    for(i=0;i<h3_texts.length;i++){
        h3_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*4.65)+"px";
    }
    for(i=0;i<span_texts.length;i++){
        span_texts[i].style.fontSize = RefreshWAndH()/((RefreshWAndH()**-1*100000)*4.65)+"px";
    }
})

document.addEventListener("keydown", (e) => {
    if(e.key == "e"){
        console.log(tracking_element);
        console.log(whichinvslotishovering)
    }
})
