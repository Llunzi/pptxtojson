import { getTextByPathList } from './utils'
import { getShadow } from './shadow'
import { getFillType, getSolidFill } from './fill'

export function getFontType(node, type, warpObj) {
  let typeface = getTextByPathList(node, ['a:rPr', 'a:latin', 'attrs', 'typeface'])

  if (!typeface) {
    const fontSchemeNode = getTextByPathList(warpObj['themeContent'], ['a:theme', 'a:themeElements', 'a:fontScheme'])

    if (type === 'title' || type === 'subTitle' || type === 'ctrTitle') {
      typeface = getTextByPathList(fontSchemeNode, ['a:majorFont', 'a:latin', 'attrs', 'typeface'])
    } 
    else if (type === 'body') {
      typeface = getTextByPathList(fontSchemeNode, ['a:minorFont', 'a:latin', 'attrs', 'typeface'])
    } 
    else {
      typeface = getTextByPathList(fontSchemeNode, ['a:minorFont', 'a:latin', 'attrs', 'typeface'])
    }
  }

  return typeface || ''
}

export function getFontColor(node, pNode, lstStyle, pFontStyle, lvl, warpObj) {
  const rPrNode = getTextByPathList(node, ['a:rPr'])
  let filTyp, color, themeType
  if (rPrNode) {
    filTyp = getFillType(rPrNode)
    if (filTyp === 'SOLID_FILL') {
      const solidFillNode = rPrNode['a:solidFill']
      const { color: colorVal, schemeVal: themeTypeVal } = getSolidFill(solidFillNode, undefined, undefined, warpObj)
      color = colorVal
      themeType = themeTypeVal
    }
  }
  if (!color && getTextByPathList(lstStyle, ['a:lvl' + lvl + 'pPr', 'a:defRPr'])) {
    const lstStyledefRPr = getTextByPathList(lstStyle, ['a:lvl' + lvl + 'pPr', 'a:defRPr'])
    filTyp = getFillType(lstStyledefRPr)
    if (filTyp === 'SOLID_FILL') {
      const solidFillNode = lstStyledefRPr['a:solidFill']
      const { color: colorVal, schemeVal: themeTypeVal } = getSolidFill(solidFillNode, undefined, undefined, warpObj)
      color = colorVal
      themeType = themeTypeVal
    }
  }
  if (!color) {
    const sPstyle = getTextByPathList(pNode, ['p:style', 'a:fontRef'])
    if (sPstyle) ({color, schemeVal: themeType} = getSolidFill(sPstyle, undefined, undefined, warpObj))
    if (!color && pFontStyle) ({color, schemeVal: themeType} = getSolidFill(pFontStyle, undefined, undefined, warpObj))
  }
  return {
    color: color || '',
    themeType
  }
}

export function getFontSize(node, slideLayoutSpNode, type, slideMasterTextStyles) {
  let fontSize

  if (getTextByPathList(node, ['a:rPr', 'attrs', 'sz'])) fontSize = getTextByPathList(node, ['a:rPr', 'attrs', 'sz']) / 100

  if ((isNaN(fontSize) || !fontSize)) {
    const sz = getTextByPathList(slideLayoutSpNode, ['p:txBody', 'a:lstStyle', 'a:lvl1pPr', 'a:defRPr', 'attrs', 'sz'])
    fontSize = parseInt(sz) / 100
  }

  if (isNaN(fontSize) || !fontSize) {
    let sz
    if (type === 'title' || type === 'subTitle' || type === 'ctrTitle') {
      sz = getTextByPathList(slideMasterTextStyles, ['p:titleStyle', 'a:lvl1pPr', 'a:defRPr', 'attrs', 'sz'])
    } 
    else if (type === 'body') {
      sz = getTextByPathList(slideMasterTextStyles, ['p:bodyStyle', 'a:lvl1pPr', 'a:defRPr', 'attrs', 'sz'])
    } 
    else if (type === 'dt' || type === 'sldNum') {
      sz = '1200'
    } 
    else if (!type) {
      sz = getTextByPathList(slideMasterTextStyles, ['p:otherStyle', 'a:lvl1pPr', 'a:defRPr', 'attrs', 'sz'])
    }
    if (sz) fontSize = parseInt(sz) / 100
  }

  const baseline = getTextByPathList(node, ['a:rPr', 'attrs', 'baseline'])
  if (baseline && !isNaN(fontSize)) fontSize -= 10

  fontSize = (isNaN(fontSize) || !fontSize) ? 18 : fontSize

  return fontSize + 'pt'
}

export function getFontBold(node) {
  const bold = getTextByPathList(node, ['a:rPr', 'attrs', 'b'])
  return bold === '1' || bold === 'true' ? 'bold' : ''
}

export function getFontItalic(node) {
  const italic = getTextByPathList(node, ['a:rPr', 'attrs', 'i'])
  return italic === '1' || italic === 'true' ? 'italic' : ''
}

export function getFontDecoration(node) {
  const underline = getTextByPathList(node, ['a:rPr', 'attrs', 'u'])
  return underline === 'sng' ? 'underline' : ''
}

export function getFontDecorationLine(node) {
  const strike = getTextByPathList(node, ['a:rPr', 'attrs', 'strike'])
  return strike === 'sngStrike' ? 'line-through' : ''
}

export function getFontSpace(node) {
  const spc = getTextByPathList(node, ['a:rPr', 'attrs', 'spc'])
  return spc ? (parseInt(spc) / 100 + 'pt') : ''
}

export function getFontSubscript(node) {
  const baseline = getTextByPathList(node, ['a:rPr', 'attrs', 'baseline'])
  if (!baseline) return ''
  return parseInt(baseline) > 0 ? 'super' : 'sub'
}

export function getFontShadow(node, warpObj) {
  const txtShadow = getTextByPathList(node, ['a:rPr', 'a:effectLst', 'a:outerShdw'])
  if (txtShadow) {
    const shadow = getShadow(txtShadow, warpObj)
    if (shadow) {
      const { h, v, blur, color, themeType } = shadow
      // const { h, v, blur, color } = shadow
      if (!isNaN(v) && !isNaN(h)) {
        return h + 'pt ' + v + 'pt ' + (blur ? blur + 'pt' : '') + ' ' + color + (themeType ? ' ' + themeType : '')
      }
    }
  }
  return ''
}