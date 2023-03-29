"use strict"

document.addEventListener("DOMContentLoaded",()=>{
    const mode_button = document.querySelector("#light_mode_button");
    const body = document.querySelector("body");

    function isElementInViewport (el) {
        var rect = el.getBoundingClientRect();
    
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.top+20 <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
        );
    }
    
    const anim = document.querySelectorAll('[data-appear]');
    anim.forEach((child)=>{
        child.style.opacity = '0';
    });
    function updateAnim(){
        anim.forEach((child)=>{
            if(!child.classList.contains('appear')){
                if(isElementInViewport(child)){
                    child.classList.add('appear');
                    child.style.opacity = '1';
                }
            }
        });
    }
    updateAnim();


    if(window.localStorage.getItem("LightMode") == null){
        setLightMode(true);
    }else
    {
        setLightMode(window.localStorage.getItem("LightMode") == "true" );
    }
    setTimeout(setTransition,1000);
    function setTransition(){
        body.classList.add("lmode_transition");
    }
    function setLightMode(mode){
        if(mode){
            body.classList.remove("dark");
            body.classList.add("light");
            window.localStorage.setItem("LightMode",true);
        }
        else{
            body.classList.remove("light");
            body.classList.add("dark");
            window.localStorage.setItem("LightMode",false);
        }
    }
   
    mode_button.addEventListener('click',(e)=>{
        if(body.classList.contains("light") ){
            setLightMode(false);
        }else{
            setLightMode(true);
        }
        
    });
    //counter anim
    const counters = document.querySelector(".counters-block__content");
    let isCounterAnimated = false;
    function animateCounter(){
        isCounterAnimated =true;
        const animDuration = 1000;
        const counters = document.querySelectorAll(".counters-block_item");

        function anim(obj, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
              if (!startTimestamp) startTimestamp = timestamp;
              const progress = Math.min((timestamp - startTimestamp) / duration, 1);
              obj.textContent = `${Math.floor(progress * (end - start) + start)}+`;
              if (progress < 1) {
                window.requestAnimationFrame(step);
              }
            };
            window.requestAnimationFrame(step);
        }
          
        counters.forEach((counter,index)=>{
            anim(counter.firstElementChild,0,+counter.firstElementChild.getAttribute("data-count"),animDuration+index*350);
        });

    };
    //scroll 
    const header = document.querySelector('.header');
    

    window.addEventListener('scroll',(e)=>{

        if(window.scrollY >= 96){
            header.classList.add('hdr_scrl');
        }else{
            header.classList.remove('hdr_scrl');
        }
        //counter anim
        if(!isCounterAnimated){
            if(isElementInViewport(counters)){animateCounter();}
        }
        //all anim
        updateAnim();
        
    });

    //arrow up

    const arrow = document.querySelector('.footer__arrow span');
    arrow.addEventListener('click',() =>{
        document.documentElement.scrollTo(0,0);
    });

    //popup
    const popupButtons = document.querySelectorAll('button.popupButton');
    const popup = document.querySelector('.popup');
    const closeButton = document.querySelector('.popup__form span');
    function closePopup(){
        popup.classList.add('hide');
        popup.classList.remove('show')
    }
    popupButtons.forEach((btn)=>{
        btn.addEventListener('click',()=>{
            popup.classList.remove('hide');
            popup.classList.add('show');
        });
    });

    popup.addEventListener('click',(e)=>{
        if(e.target == popup || e.target == closeButton){
            closePopup();
        }
    });
    document.addEventListener('keydown',(e)=>{
        if(e.code == 'Escape' && !popup.classList.contains('hide')){
            closePopup();
        }
    });


    //road map
    const roadmapItems = document.querySelectorAll('.roadmap-block__item');
    roadmapItems.forEach((element)=>{
        element.addEventListener('mouseenter',(e)=>{
            e.target.classList.remove('closed');
        });
        element.addEventListener('mouseleave',(e)=>{
            e.target.classList.add('closed');
        });
        element.addEventListener('click',(e)=>{
            e.currentTarget.classList.remove('closed');
        });
    });

    

    //form upload

    const form1 = document.querySelector('#f1');
    const form2 = document.querySelector('#f2');
    const sumbitAnim = document.querySelector('.sucessful');

    form1.addEventListener('submit',handleSumbit);
    form2.addEventListener('submit',handleSumbit);

    async function handleSumbit(e){
        e.preventDefault();
        const $form = e.target,
        $name = $form.querySelector('input[name="name"]'),
        $phone = $form.querySelector('input[name="phone"]'),
        $comment = $form.querySelector('[name="comment"]');
        let x = new Date();
        const response = await fetch('https://api.apispreadsheets.com/data/F9RXYSHtTAoKsjt3',{
            method: 'POST',
            body: JSON.stringify({
                data:{
                    date:x.toString(),
                    name: $name.value,
                    phone: `'${$phone.value}`,
                    comment:($comment == null)? 'Відправка без коментаря': $comment.value
                }
            })
        });
        if (response.status === 201){
            if(!popup.classList.contains('hide')){
                closePopup();
            }
            if(sumbitAnim.classList.contains('sucessful_anim')){
                sumbitAnim.classList.remove('sucessful_anim');
            }
            setTimeout(()=>{
                sumbitAnim.classList.add('sucessful_anim');
            },10)
        }
        else{
            alert('Помилка відправки. Спробуйте знову!');
        }

        
        form1.reset();
        form2.reset();

    }

   

});

window.addEventListener('load', function () {
    const glider = new Glide('.glide',{
        type:"carousel",
        autoplay:2000,
        hoverpause:false,
        startAt: 0,
        perView: (window.matchMedia("(max-width: 1000px)").matches) ? 1 :2,
        gap:32,
    });
    glider.mount();
    window.addEventListener("resize",()=>{
        glider.update({
            type:"carousel",
            autoplay:2000,
            hoverpause:false,
            startAt: 0,
            perView: (window.matchMedia("(max-width: 1000px)").matches) ? 1 :2,
            gap:32,
        });
    });

    //цей рядок фіксить проблему з неправильними розмірами слайдера
    window.dispatchEvent(new Event('resize'));
  });