import React, { useEffect, useRef, useState } from 'react'
import "./Panel.css"
import addIcon from '../images/add.svg'
import imgSpider from '../images/spider.webp'
import imgSend from '../images/send.svg'
import imgLoading from '../images/loading.svg'
import imgAdd2 from '../images/add2.png'
import imgNoImage from '../images/noImage.png'
/*
async function query(data) {
	const response = await fetch(
		"https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
		{
			headers: { 
				"Accept": "image/png",
				"Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM", 
				"Content-Type": "application/json" 
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
}
query({"inputs": "Astronaut riding a horse"}).then((response) => {
	// Use image
});

*/
export default function Panel(props) {
    const {img, index, resize, edit} = props

    const refPanel = useRef(null)
    const refPanelBox = useRef(null)
    const refDefaultImg = useRef(null)
    const refImg = useRef(null)
    const refImgBox = useRef(null)
    const refLoading = useRef(null)

    const [input, setInput] = useState("")
    const [toggle, setToggle] = useState(false)
    const [panelWidth, setPanelWidth] = useState('')
    const [panelHeight, setPanelHeight] = useState('')
    const [imgSrc, setImgSrc] = useState(imgNoImage)
    const [dialogue, setDialogue] = useState("")

    const openPromt = () => {
      document.body.style.overflow = 'hidden'
      
      const panel = refPanel.current
      const panelBox = refPanelBox.current
      const defaultImg = refDefaultImg.current
      const img = refImg.current
      const imgBox = refImgBox.current
      

      const offSetLeft = panelBox.getBoundingClientRect().left
      const offSetTop = panelBox.getBoundingClientRect().top
      const windowWidth = window.innerWidth
      const windowheight = window.innerHeight

      panel.style.transform = `translate(${-offSetLeft}px, ${-offSetTop}px)`
      setPanelWidth(panel.style.height)
      setPanelHeight(panel.style.height)
      // panel.style.width = `${windowWidth}px`
      // panel.style.height = `${windowheight}px`
      panel.style.width = `100vw`
      panel.style.height = `100vh`
      panel.style.zIndex = 100

      defaultImg.style.margin = `20px`;
      defaultImg.style.transform = `rotate(45deg)`

      imgBox.style.display = 'grid'

      console.log(offSetLeft, ` translate(${offSetLeft + 20}px)`)
    }

    const closePrompt = () => {
      document.body.style.overflowY  = 'scroll'
      console.log("close")

      const panel = refPanel.current
      const panelBox = refPanelBox.current
      const defaultImg = refDefaultImg.current
      const img = refImg.current
      const imgBox = refImgBox.current
      

      panel.style.transform = `translate(0px, 0px)`
      panel.style.width = `360px`
      panel.style.height = `360px`
      panel.style.zIndex = 1

      defaultImg.style.margin = `calc(50% - 25px) calc(50% - 25px)`;
      defaultImg.style.transform = `rotate(0deg)`

      imgBox.style.display = 'none'

    }

    async function query(data) {
      console.log(data)
      try {
        
        const response = await fetch(
          "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
          {
            headers: { 
              "Accept": "image/png",
              "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM", 
              "Content-Type": "application/json" 
            },
            method: "POST",
            body: JSON.stringify(data),
          }
        );
        console.log("Fetched data from server")
        const result = await response.blob();
        console.log("changed data to blob")
        return {successful: true,result: result};
      } catch (error) {   
        return {successful: false, result: "Something went wrong try again after some time"};
      }
    }

    const handleRequest = e => {
      const loading = refLoading.current
      loading.style.display = 'flex'
      query({"inputs": input}).then((response) => {

        if(response.successful)
          setImgSrc(URL.createObjectURL(response.result))
        else {
          alert("1: " + response.result)
          console.log("1: " + response.result)
        }
        loading.style.display = 'none'
        
      }).catch(err => {
        loading.style.display = 'none'
        console.log(err)
        alert("2: " + err)
      })
    }

    useEffect(() => {
      if(edit) {
        const panel = refPanel.current
        // panel.style.transition = `0.5s cubic-bezier(0.075, 0.82, 0.165, 1)`
        if(toggle){
          openPromt()
        } else { 
          closePrompt()
        }
        console.log(toggle)
      }
      return () => {
      }
    }, [toggle])

    useEffect(() => {
      if(edit && toggle) {
        const panel = refPanel.current
        // panel.style.transition = `0s`
        openPromt()
      }
      return () => {
      }
    }, [resize])
    
    const handleAbort = () => {
      console.log('abort')
      const loading = refLoading.current
      loading.style.display = 'none'
    }

    const handleScaleUp = () => {
      const panel = refPanel.current
      panel.style.transform = `scale(1.5)`
      panel.style.zIndex = 200
    }
    const handleScaleDown = () => {
      const panel = refPanel.current
      panel.style.transform = `scale(1)`
      panel.style.zIndex = 1
    }

  return (
    <div className='PanelBox' ref={refPanelBox}>
      <div className='Panel' ref={refPanel} onMouseEnter={e => {if(!edit) handleScaleUp()}} onMouseLeave={e => {if(!edit) handleScaleDown()}}>
          <div className='Loading'  ref={refLoading}>
            <img src={imgLoading}/>
            <button onClick={e => handleAbort()}>Cancel</button>
          </div>
          {edit ? <button ref={refDefaultImg} className='DefaultImg' onClick={() => setToggle(toggle ? false: true )}></button> : ''}
          <div className='ImgBox'>
            <img src={imgSrc} className='Img' style={{filter: imgSrc == imgNoImage ? `brightness(3.5) drop-shadow(2px 4px 9px black)` : ``}}/>
            <div className='Dialogue'><span>{dialogue}</span></div>
          </div>
          <div className='InputBox' ref={refImgBox}>
            <input placeholder='Enter Prompt for image here' className='Input' value={input} onChange={e => setInput(e.target.value)} />
            <input maxLength={80} placeholder='Enter text for speech bubble' className='DialogueInput' value={dialogue} onChange={e => setDialogue(e.target.value)} />
            <button onClick={e => handleRequest(e)}><img ref={refImg} className='Send' src={imgSend} /></button>
          </div>
      </div>
    </div>
  )
}
