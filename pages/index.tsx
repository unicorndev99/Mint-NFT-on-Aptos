import type { NextPage } from 'next'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from '../styles/home.module.scss'
import { createInflate } from 'zlib'
import toast from "../components/Toast"

const Home: NextPage = () => {
  const [isMartian, setMartian] = useState(false)
  const [isConnected, setConnect] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [viewType, setViewType] = useState('simple')
  const [address, setAddress] = useState('')

  const [nftImgUrl, setNftImgUrl] = useState("")
  const [nftName, setNftName] = useState("")
  const [nftDescription, setNftDescription] = useState("")

  const btnConnect = async () => {
    await window.martian.connect()
    const isConnected = await window.martian.isConnected()
    setConnect(isConnected)
    if(isConnected) {
      const martianAccount = await window.martian.account()
      setAddress(martianAccount.address)
    }
  }

  useEffect(()=>{
    if ("martian" in window) {
      setMartian(true)
    }  
  }, [])

  const notify = useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const btnCreateNft = async () => {
    // Create a collection
    // const txnHash1 = await window.martian.createCollection("ColName123", "CollectionDescription", "https://aptos.dev")
    console.log(nftName, nftDescription, nftImgUrl, imageError)
    if(nftName == '') {
      notify("error", "Input nft name!")
      return
    }
    if(nftDescription == '') {
      notify("error", "Input nft description!")
      return
    }
    if(nftImgUrl == '' || imageError) {
      notify("error", "Input valid image url!")
      return
    }
    // Create Token
    const txnHash = await window.martian.createToken("ColName123", nftName, nftDescription, 1, nftImgUrl, 1)
  }

  return (
    <div className={`${styles.homeContainer} flex flex-col justify-center items-center h-full w-full`}>
      <div className='flex flex-col justify-center items-center h-full w-full'>
        {
          !isMartian ? (
            <>
              <p style={{fontSize: '25px'}}>It seems like you have not installed<span className={styles.textDarkgreen} style={{fontWeight: 400}}> Martian wallet </span>extension.</p>
              <a href={"https://www.martianwallet.xyz/"} target={"_blank"} className={styles.textDarkgreen} style={{fontWeight: 500, fontSize: '25px'}}>Click here</a>
            </>
          ) : (
            !isConnected ? (
              <button className={`${styles.btn} !px-[30px]`} onClick={btnConnect}>
                {/* onClick={() => setConnect(true)}> */}
                Connect <span className={styles.textGreen}>Aptos</span> wallet
              </button>
            ) : (
              <>
                <div className='flex flex-row justify-between items-start w-full' style={{width: viewType=='simple' ? '40%' : '60%', marginTop: '60px'}}>
                  {
                    viewType != 'simple' &&
                    <div className='flex flex-col justify-center items-center'>
                      <h2 className='mb-[10px] font-semibold text-[20px]'>Create NFT Collection</h2>
                      <input className={`${styles.input} c-step-1`} placeholder="NFT Collection name" type="text"/>
                      <input className={`${styles.input} c-step-2`} placeholder="NFT Collection description" type="text"/>
                      <input className={`${styles.input} c-step-3`} placeholder="NFT Collection Url" type="text"/>
                      <button className={`${styles.filledBtn} py-[10px] px-[25px] bg-[rgb(21, 215, 145)] text-[#000] font-semibold`}>Create NFT Collection</button>
                    </div>
                  }
                  <div className='flex flex-col justify-center items-center'>
                    <h2 className='mb-[10px] font-semibold'>Create NFT</h2>
                    <input className={`${styles.input} s-step-1`} placeholder="NFT name" type="text" value={nftName} onChange={(e)=>setNftName(e.target.value)}/>
                    <input className={`${styles.input} s-step-2`} placeholder="NFT Description" type="text" value={nftDescription} onChange={(e)=>setNftDescription(e.target.value)}/>
                    {viewType != 'simple' && <input className={`${styles.input} s-step-6`} placeholder="NFT collection name" type="text"/>}
                    <input className={`${styles.input} s-step-3`} placeholder="NFT Url" type="text" onChange={(e) => {setNftImgUrl(e.target.value); setImageError(false)}}/>
                    <button className={`${styles.filledBtn} py-[10px] px-[25px] bg-[rgb(21, 215, 145)] text-[#000] font-semibold`} onClick={btnCreateNft}>Create NFT</button>
                  </div>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='mb-[10px]'>NFT preview</p>
                    <img src={imageError?'/image/initimg.svg':nftImgUrl} alt="nft-image" onError={(e)=>{setImageError(true)}} data-src={nftImgUrl} className='h-[200px] w-[200px] border-solid border-[1px] border-[rgb(78, 78, 78)] bg-[black] visible'/>
                  </div>

                </div>
                <p className={`${styles.absolute_div} !top-[30px] !right-[240px] !w-[250px]`} onClick={() => setViewType(viewType=='simple'?'advance':'simple')}>Switch to Advanced view</p>
                <button className={`${styles.absolute_div} ${styles.btn} ${styles.textGreen} !top-[30px] !right-[515px] !w-[250px]`}>
                  {address.substring(0, 6) + "..." + address.substring(address.length - 4)}
                </button>
              </>
            )
          )
        }
      </div>
      
      <Link href={'/'}>
        <a className={`${styles.absolute_div} left-[70px]`}>
          <img src="/image/martian.png" alt="Logo" width={23} height={23} />
          <p>Martian</p>
        </a>
      </Link>
      <Link href={'/'}>
        <a className={`${styles.absolute_div} right-[70px]`}>
          <p>Tutorial</p>
        </a>
      </Link>
    </div>
  )
}

export default Home
