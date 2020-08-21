setTimeout(() => {
    items = document.querySelectorAll("#main_container_bot > div.items > div.item")
    for (let item of items){
        let price = item.querySelector("div.wrapper__price > div").textContent.trim().slice(3)
        let float = item.querySelector("div.ov > div > div.ov_fls > div").textContent
        let name = item.querySelectorAll("div")[item.querySelectorAll("div").length - 1].textContent
        let cvol = item.querySelector("div.s_c > div").textContent.trim().slice(0, 3)
        console.log(`name: ${name} ${cvol}  float: ${float}  price: ${price}`)
    }
}, 12000)
