import { readXmlFile } from './readXmlFile'
import { getTextByPathList } from './utils'

async function fntdata(zip) {
  const presentationJson = await readXmlFile(zip, 'ppt/_rels/presentation.xml.rels')
  const rootPresentation = await readXmlFile(zip, 'ppt/presentation.xml')

  const embeddedFont = getTextByPathList(rootPresentation, ['p:presentation', 'p:embeddedFontLst', 'p:embeddedFont']) || []

  const subObj = presentationJson['Relationships']['Relationship']
  const fontList = []

  for (const item of subObj) {
    switch (item['attrs']['Type']) {
      case 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/font':
        const fntdataJson = zip.files['ppt/' + item['attrs'].Target]
        console.log('fntdataJson', fntdataJson)

        const fileData = await fntdataJson.async('arraybuffer')
 
        const ttfData = extractTTFFromEOT(fileData)
        

        const font = embeddedFont.find(font => {
          const rId = getTextByPathList(font, ['p:regular', 'attrs', 'r:id']) 
          return item.attrs.Id === rId
        })

        const typeface = font['p:font'].attrs.typeface

        fontList.push({ name, ttfData, typeface })

        break
      default:
    }
  }
  
  return fontList
}


// EOT文件头的大小通常是固定的，但实际值可能因文件而异
const EOT_HEADER_SIZE = 512

/**
 * 将EOT格式字体转换为TTF格式
 * @param {string} eotFilePath EOT文件路径
 * @param {string} ttfOutputPath 输出的TTF文件路径
 * @returns {Promise<boolean>} 是否转换成功
 */
export function convertEOTtoTTF(eotData) {
  try {
    
    // 提取TTF数据
    const ttfData = extractTTFFromEOT(eotData)
    if (!ttfData || ttfData.length === 0) {
      console.error('无法从EOT文件中提取TTF数据')
      return null
    }

    // 原始代码使用了ttf2woff2，但为了避免构建问题，暂时直接返回TTF数据
    // const woff2Data = convertTTFToWOFF2(ttfData)
    // if (!woff2Data || woff2Data.length === 0) {
    //   console.error('无法将TTF数据转换为WOFF2格式')
    //   return null
    // }
    
    console.log(`成功提取TTF字体数据`)
    return ttfData
  }
  catch (error) {
    console.error(`转换字体文件时发生错误: ${error.message}`)
    return null
  }
}


/**
 * 从EOT文件数据中提取TTF数据
 * EOT格式是TTF/OTF格式的包装器，包含了一个头部和元数据，后面跟着实际的TTF/OTF字体数据
 * @param {Buffer} eotData EOT文件的字节数据
 * @returns {Buffer|null} TTF字体数据
 */
function extractTTFFromEOT(eotData) {
  try {
    // EOT文件格式相对复杂，以下是一个简化的实现
    
    // 尝试寻找TTF签名 (0x00010000 或 'OTTO' 或 'true' 或 'typ1')
    let ttfStartOffset = -1
    for (let i = 0; i < eotData.length - 4; i++) {
      if ((eotData[i] === 0x00 && eotData[i + 1] === 0x01 && eotData[i + 2] === 0x00 && eotData[i + 3] === 0x00) ||
          (eotData[i] === 0x4F && eotData[i + 1] === 0x54 && eotData[i + 2] === 0x54 && eotData[i + 3] === 0x4F) || // 'OTTO'
          (eotData[i] === 0x74 && eotData[i + 1] === 0x72 && eotData[i + 2] === 0x75 && eotData[i + 3] === 0x65) || // 'true'
          (eotData[i] === 0x74 && eotData[i + 1] === 0x79 && eotData[i + 2] === 0x70 && eotData[i + 3] === 0x31)) { // 'typ1'
        ttfStartOffset = i
        break
      }
    }
    
    // 如果找不到TTF签名，则尝试使用固定偏移
    if (ttfStartOffset === -1) {
      console.log('无法找到TTF签名，尝试使用固定偏移量')
      ttfStartOffset = EOT_HEADER_SIZE
    }
    
    // 提取TTF数据
    const ttfData = eotData.slice(ttfStartOffset)
    
    console.log(`从EOT文件中提取了${ttfData.length}字节的TTF数据`)
    return ttfData
  }
  catch (error) {
    console.error(`提取TTF数据时发生错误: ${error.message}`)
    return null
  }
}

export default fntdata
