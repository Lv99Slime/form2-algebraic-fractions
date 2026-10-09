/* Chapter 3: full teacher-approved LN pp3–4. Original questions first.
   38 core tasks; *9 is optional. Prior factorization methods already taught. */
window.DECK=window.DECK||[];
(function(){
  'use strict';
  const M=s=>`\\(${s}\\)`;
  const btn=(id,label,cls='')=>`<button type="button" id="${id}" class="pbtn ${cls}">${label}</button>`;
  const token=(tex,cls='')=>`<span class="factor ${cls}">${M(tex)}</span>`;
  const product=(a,b,cancel=false)=>`${token(a,'common'+(cancel?' cancelled':''))}<span class="times">×</span>${token(b)}`;
  const fraction=(top,bottom,label)=>`<div class="factor-fraction" role="group" aria-label="${label}"><div class="factor-numerator">${top}</div><div class="factor-denominator">${bottom}</div></div>`;
  const line=(tex,cls='')=>`<div class="math-line ${cls}">${M(tex)}</div>`;
  // Clear MathJax's old items before replacing a revealed state.
  function mount(h,max,render,options={}){
    let step=0,hint=false,choice='';
    h.innerHTML=`<div class="pilot-panel lesson-panel"><div class="step-count" id="count"></div>${options.choice?`<div class="choices">${btn('yes','Yes')}${btn('no','No')}</div>`:''}<div id="sequence" class="lesson-content" aria-live="polite"></div><div class="actions">${btn('prev','Previous step')}${btn('next','Next step','primary')}${options.hint?btn('hint','Analyze'):''}${btn('reset','Reset')}</div></div>`;
    const body=h.querySelector('#sequence');
    const draw=()=>{
      if(window.MathJax&&MathJax.typesetClear)MathJax.typesetClear([body]);
      h.querySelector('#count').textContent=`${step} / ${max}`;
      h.querySelector('#prev').disabled=step===0;h.querySelector('#next').disabled=step===max;
      body.innerHTML=render(step,hint,choice);
      body.dataset.step=String(step);
      if(options.hint){const b=h.querySelector('#hint');b.textContent=hint?'Hide analysis':'Analyze';b.setAttribute('aria-pressed',String(hint));}
      if(options.choice)for(const id of ['yes','no'])h.querySelector('#'+id).setAttribute('aria-pressed',String(choice===id));
      if(options.afterDraw)options.afterDraw(step,hint,draw);
      if(window.MJ)window.MJ(h);
    };
    h.querySelector('#prev').onclick=()=>{step=Math.max(0,step-1);draw();};
    h.querySelector('#next').onclick=()=>{step=Math.min(max,step+1);draw();};
    h.querySelector('#reset').onclick=()=>{step=0;hint=false;choice='';if(options.onReset)options.onReset();draw();};
    if(options.hint)h.querySelector('#hint').onclick=()=>{hint=!hint;draw();};
    if(options.choice)for(const id of ['yes','no'])h.querySelector('#'+id).onclick=()=>{choice=id;draw();};
    draw();
  }
  function check(h){
    mount(h,2,(n,_hint,choice)=>{
      if(!n)return '';
      if(n===1)return `<div class="term-comparison"><div><small>Numerator: a sum</small>${line('\\boxed{x+y}')}<p>The whole numerator is ${M('x+y')}.</p></div><div><small>Denominator: a product</small>${line('3\\times x')}<p>${M('x')} is a factor here.</p></div></div><p class="teaching-note">Here, ${M('x')} is not a factor of the whole numerator.</p>`;
      return `<div class="decision">${choice?(choice==='yes'?'Yes.':'The answer is Yes.'):'Yes.'}</div><p class="teaching-note">The fraction is already in its simplest form.</p>${line('\\frac{x+y}{3x}','answer')}<p class="teaching-note">There is no common factor to cancel.</p><p class="domain">Original denominator: ${M('x\\ne0')}.</p>`;
    },{choice:true});
  }
  function analyse(h){
    mount(h,4,n=>{
      if(!n)return '';
      if(n===1)return `<div class="decomposition"><small>Numerator</small>${line('3x+6xy=\\color{#52664b}{3x}(1+2y)')}<small>Denominator</small>${line('6x=\\color{#52664b}{3x}\\times2')}</div>`;
      if(n===2||n===3)return `${fraction(product('3x','(1+2y)',n===3),product('3x','2',n===3),'3x times (1 + 2y), divided by 3x times 2')}<p class="teaching-note">${n===2?'The same factor multiplies the whole numerator and denominator.':`Divide both by ${M('3x')}, where ${M('x\\ne0')}.`}</p>`;
      return `${line('\\frac{1+2y}{2}','answer large')}<p class="teaching-note">Cancel the common factor, not a term.</p><p class="domain">Original denominator: ${M('x\\ne0')}.</p>`;
    });
  }
  function solve(h){
    const rows=['\\frac{3x+6xy}{6x}=\\frac{3x(1+2y)}{3x\\times2}','=\\frac{1+2y}{2}'];
    mount(h,2,n=>n?`<div class="calculation-stack">${rows.slice(0,n).map((t,i)=>line(t,i===1?'answer':'')).join('')}</div><p class="domain">Original denominator: ${M('x\\ne0')}.</p>`:'');
  }
  function attempt(h){
    const rows=['\\frac{8ab}{4a-8ab}=\\frac{4a\\times2b}{4a(1-2b)}','=\\frac{2b}{1-2b}'];
    mount(h,2,(n,hint)=>{
      const analysis=hint?`<div class="optional-analysis"><p>What factor is common to both terms in the denominator?</p>${fraction(product('4a','2b'),product('4a','(1-2b)'),'4a times 2b, divided by 4a times (1 - 2b)')}</div>`:'';
      return analysis+(n?`<div class="calculation-stack">${rows.slice(0,n).map((t,i)=>line(t,i===1?'answer':'')).join('')}</div>${n===2?`<p class="domain">Original denominator: ${M('a\\ne0')} and ${M('b\\ne\\frac12')}.</p>`:''}`:'');
    },{hint:true});
  }
const T=String.raw;
  // Questions are transcribed from LN pp3–4. Hints never appear at step zero.
  const Q=(id,q,steps,domain,hint,decision)=>({id,q,steps,domain,hint,decision});
  const items=[
    Q('C1',T`\frac{x^5}{x^2y}=\frac{(\quad)}y`,[T`\frac{x^2\cdot x^3}{x^2y}=\frac{x^3}y`,T`\text{Blank: }x^3`],T`x\ne0,\ y\ne0`,'Write the powers as products.'),
    Q('C2',T`\frac3{xy}=\frac{(\quad)}{x^2y}`,[T`\frac{3\cdot x}{xy\cdot x}=\frac{3x}{x^2y}`,T`\text{Blank: }3x`],T`x\ne0,\ y\ne0`,'Multiply both parts by the same non-zero factor.'),
    Q('C3',T`\frac{0.5a}{3b}=\frac{a^3b}{(\quad)}`,[T`0.5a\cdot2a^2b=a^3b`,T`3b\cdot2a^2b=6a^2b^2`,T`\text{Blank: }6a^2b^2`],T`b\ne0`,'What factor changes the given numerator to the new numerator?'),
    Q('C4',T`\frac{3x^2+3xy}{6x^2}=\frac{x+y}{(\quad)}`,[T`\frac{3x(x+y)}{3x\cdot2x}=\frac{x+y}{2x}`,T`\text{Blank: }2x`],T`x\ne0`,'Factorize the whole numerator.'),
    Q('C5',T`\frac{6xy}{8x^2y-2xy^2}=\frac3{(\quad)}`,[T`\frac{2xy\cdot3}{2xy(4x-y)}=\frac3{4x-y}`,T`\text{Blank: }4x-y`],T`x\ne0,\ y\ne0,\ 4x-y\ne0`,'Find a factor of both denominator terms.'),
    Q('C6',T`\frac{x^2-y^2}{(x+y)^2}=\frac{x-y}{(\quad)}`,[T`\frac{(x-y)(x+y)}{(x+y)(x+y)}=\frac{x-y}{x+y}`,T`\text{Blank: }x+y`],T`x+y\ne0`,'Compare the factors after using an identity.'),
    Q('C7',T`\frac{3x}{8y}`,[T`\frac{3x}{8y}`],T`y\ne0`,'There is no common factor to cancel.',true),
    Q('C8',T`\frac{x^3}{5x}`,[T`\frac{x\cdot x^2}{5x}=\frac{x^2}{5}`],T`x\ne0`,'The numerator and denominator have a common factor x.',false),
    Q('C10',T`\frac a{a^2+a}`,[T`\frac a{a(a+1)}=\frac1{a+1}`],T`a\ne0,\ a\ne-1`,'Factorize the denominator before cancelling the common factor a.',false),
    Q('C11',T`\frac{x-y}{x^2-y^2}`,[T`\frac{x-y}{(x-y)(x+y)}=\frac1{x+y}`],T`x\ne y,\ x\ne-y`,'The whole expression x − y is a common factor.',false),
    Q('C12',T`\frac{x+y}{x^2+y^2}`,[T`(x+y)^2=x^2+2xy+y^2`],T`x^2+y^2\ne0`,'The denominator is a sum of squares, not the square of a sum. No common factor can be cancelled.',true),
    Q('E1a',T`\frac{7y^4}{14y^2}`,[T`\frac{7y^2\cdot y^2}{7y^2\cdot2}`,T`=\frac{y^2}{2}`],T`y\ne0`,'Separate the common factor from what remains.'),
    Q('E1b',T`-\frac{25pq^3}{10p^4q}`,[T`-\frac{5pq\cdot5q^2}{5pq\cdot2p^3}`,T`=-\frac{5q^2}{2p^3}`],T`p\ne0,\ q\ne0`,'Compare the powers of each letter. Keep the minus sign.'),
    Q('T11a',T`\frac{24x^4}{3x}`,[T`\frac{3x\cdot8x^3}{3x}`,T`=8x^3`],T`x\ne0`,'How many factors of x remain?'),
    Q('T11b',T`\frac{15a^3b^2}{6a^2b}`,[T`\frac{3a^2b\cdot5ab}{3a^2b\cdot2}`,T`=\frac{5ab}{2}`],T`a\ne0,\ b\ne0`,'Compare the coefficient and each letter separately.'),
    Q('T12a',T`\frac{4(2+x)}{16(2+x)}`,[T`\frac{4(2+x)}{4(2+x)\cdot4}`,T`=\frac14`],T`x\ne-2`,'Treat the bracket as one factor.'),
    Q('T12b',T`\frac{18x^3(x+5)}{24x^2(x+5)^2}`,[T`\frac{6x^2(x+5)\cdot3x}{6x^2(x+5)\cdot4(x+5)}`,T`=\frac{3x}{4(x+5)}`],T`x\ne0,\ x\ne-5`,'Count the bracket factors as well as the powers of x.'),
    Q('T12c',T`\frac{x-3}{3-x}`,[T`3-x=-(x-3)`,T`\frac{x-3}{-(x-3)}=-1`],T`x\ne3`,'What is the relationship between these two quantities?'),
    Q('T12d',T`\frac{4x^2(x-3)^3}{8x^3(3-x)^2}`,[T`(3-x)^2=[-(x-3)]^2=(x-3)^2`,T`\frac{4x^2(x-3)^2(x-3)}{4x^2(x-3)^2\cdot2x}`,T`=\frac{x-3}{2x}`],T`x\ne0,\ x\ne3`,'Check the effect of the square before cancelling.'),
    Q('E2b',T`\frac{xy-5y^2}{3x-15y}`,[T`\frac{y(x-5y)}{3(x-5y)}`,T`=\frac y3`],T`x\ne5y`,'Factorize both parts and compare the brackets.'),
    Q('T2b',T`\frac{12x-4x^2}{xy-3y}`,[T`\frac{4x(3-x)}{y(x-3)}`,T`=\frac{-4x(x-3)}{y(x-3)}`,T`=-\frac{4x}y`],T`x\ne3,\ y\ne0`,'After factorizing, check whether the brackets are opposites.'),
    Q('E3a',T`\frac{x^2-1}{2x+2}`,[T`\frac{(x-1)(x+1)}{2(x+1)}`,T`=\frac{x-1}{2}`],T`x\ne-1`,'Which identity fits the numerator?'),
    Q('E3b',T`\frac{5-y}{y^2-10y+25}`,[T`\frac{5-y}{(y-5)^2}`,T`=\frac{-(y-5)}{(y-5)^2}`,T`=-\frac1{y-5}=\frac1{5-y}`],T`y\ne5`,'Compare the numerator with one denominator factor.'),
    Q('E3c',T`\frac{ab-4b^2}{a^2-8ab+16b^2}`,[T`\frac{b(a-4b)}{(a-4b)^2}`,T`=\frac b{a-4b}`],T`a\ne4b`,'Recognize a perfect square in the denominator.'),
    Q('T3a',T`\frac{x^2-9}{5x-15}`,[T`\frac{(x-3)(x+3)}{5(x-3)}`,T`=\frac{x+3}{5}`],T`x\ne3`,'Compare the factors from the numerator and denominator.'),
    Q('T3b',T`\frac{a^2-4a+4}{2-a}`,[T`\frac{(a-2)^2}{2-a}`,T`=\frac{(2-a)^2}{2-a}`,T`=2-a`],T`a\ne2`,'Squaring an expression or its opposite gives the same result.'),
    Q('T3c',T`\frac{x^2+4xy+4y^2}{x^2+2xy}`,[T`\frac{(x+2y)^2}{x(x+2y)}`,T`=\frac{x+2y}x`],T`x\ne0,\ x+2y\ne0`,'Look for a perfect square and a common factor.'),
    Q('R1',T`\frac{20a^2b^2c^5}{-3ab^3c^3}`,[T`-\frac{ab^2c^3\cdot20ac^2}{ab^2c^3\cdot3b}`,T`=-\frac{20ac^2}{3b}`],T`a\ne0,\ b\ne0,\ c\ne0`,'Compare the powers; retain the negative sign.'),
    Q('R2',T`\frac{8xy-4x^2}{6y^2-3xy}`,[T`\frac{4x(2y-x)}{3y(2y-x)}`,T`=\frac{4x}{3y}`],T`y\ne0,\ 2y-x\ne0`,'Factorize each part before deciding what can cancel.'),
    Q('R3',T`\frac{a+b+5}{ab+b^2+5b}`,[T`\frac{a+b+5}{b(a+b+5)}`,T`=\frac1b`],T`b\ne0,\ a+b+5\ne0`,'Look for one factor of all three denominator terms.'),
    Q('R4',T`\frac{x^2-3x}{x^2-9}`,[T`\frac{x(x-3)}{(x-3)(x+3)}`,T`=\frac x{x+3}`],T`x\ne3,\ x\ne-3`,'The numerator and denominator need different factorizations.'),
    Q('R5',T`\frac{x^2-25}{x^2+10x+25}`,[T`\frac{(x-5)(x+5)}{(x+5)^2}`,T`=\frac{x-5}{x+5}`],T`x\ne-5`,'Compare the factors from the two identities.'),
    Q('R6',T`\frac{8x^2-16xy+8y^2}{4x-4y}`,[T`\frac{8(x^2-2xy+y^2)}{4(x-y)}`,T`=\frac{8(x-y)^2}{4(x-y)}`,T`=2(x-y)`],T`x\ne y`,'Take out a numerical factor first.'),
    Q('R7',T`\frac{a^2+4a+3}{a^2+a-6}`,[T`\frac{(a+1)(a+3)}{(a+3)(a-2)}`,T`=\frac{a+1}{a-2}`],T`a\ne-3,\ a\ne2`,'Find factor pairs for each quadratic.'),
    Q('R8',T`\frac{a^3-6a^2+9a}{a^3+2a^2-15a}`,[T`\frac{a(a^2-6a+9)}{a(a^2+2a-15)}`,T`=\frac{a(a-3)^2}{a(a+5)(a-3)}`,T`=\frac{a-3}{a+5}`],T`a\ne0,\ a\ne-5,\ a\ne3`,'Begin with the factor common to every term.')
  ];
  const groupInfo={C:["Let's Check",'01',3],E1:['Example 1 (Level 1)','02',3],T11:["Let's Try 1.1",'02',3],T12:["Let's Try 1.2",'03',3],E2:['Example 2 (Level 1)','04',4],T2:["Let's Try 2",'04',4],E3:['Example 3 (Level 2)','05',4],T3:["Let's Try 3",'05',4],R:['Exercise','06',4]};
  function explorer(value){
    const a=value-3,b=3-value;
    return '<div class="opposite-tool"><div class="ictrl"><label for="opp-x">x = <span class="ival">'+value+'</span></label><input id="opp-x" type="range" min="-3" max="9" step="1" value="'+value+'"></div><div class="opposite-values"><span>'+M('x-3='+a)+'</span><span>'+M('3-x='+b)+'</span></div><p class="explorer-result">'+(b===0?'Original fraction: undefined (0 / 0).':M(T`\frac{x-3}{3-x}=-1`))+'</p></div>';
  }
  function worked(h,q){
    let value=2;
    const judge=typeof q.decision==='boolean';
    mount(h,judge?2:q.steps.length,(n,hint,choice)=>{
      const analysis=hint?'<div class="optional-analysis"><p>'+q.hint+'</p>'+(q.id==='T12c'?explorer(value):'')+'</div>':'';
      let body='';
      if(n){
        if(judge){
          body=n===1?line(q.steps[0]):'<div class="decision">'+(q.decision?'Yes.':'No.')+'</div><p class="teaching-note">'+q.hint+'</p>';
          if(n===2&&choice)body+='<p class="choice-feedback">'+(choice===(q.decision?'yes':'no')?'Your choice is correct.':'The answer is '+(q.decision?'Yes.':'No.'))+'</p>';
        }else body='<div class="calculation-stack">'+q.steps.slice(0,n).map((t,i)=>line(t,i===q.steps.length-1?'answer':'')).join('')+'</div>';
        body+='<p class="domain">Original denominator: '+M(q.domain)+'.</p>';
      }
      if(q.id==='C3'&&(n||hint))body+='<p class="source-note">This expansion also requires '+M(T`a\ne0`)+'. At '+M('a=0')+', the right-hand fraction is undefined.</p>';
      return analysis+body;
    },{hint:!judge,choice:judge,onReset:()=>{value=2;},afterDraw:(_n,hint,draw)=>{
      if(q.id==='T12c'&&hint)h.querySelector('#opp-x').oninput=e=>{
        value=Number(e.target.value);
        const values=h.querySelector('.opposite-values'),result=h.querySelector('.explorer-result');
        if(window.MathJax&&MathJax.typesetClear)MathJax.typesetClear([values,result]);
        h.querySelector('.ival').textContent=String(value);
        values.innerHTML='<span>'+M('x-3='+(value-3))+'</span><span>'+M('3-x='+(3-value))+'</span>';
        result.innerHTML=value===3?'Original fraction: undefined (0 / 0).':M(T`\frac{x-3}{3-x}=-1`);
        if(window.MJ)window.MJ(h);
      };
    }});
  }
  function itemSlide(q){
    const group=q.id.match(/^[A-Z]+\d*(?=[a-z]$)/)?.[0]||q.id[0];
    const part=q.id.slice(group.length),[title,sec,p]=groupInfo[group],number=group==='C'||group==='R';
    return {sec,secName:'Chapter 3 · LN p. '+p+' · Worksheet 3.1A',title,tocTitle:title.replace(/ \(Level \d\)/,'')+' '+(number?part:'('+part+')'),sourceId:q.id,sourceTex:q.q,domain:q.domain,steps:q.steps,
      points:[group==='C'?(Number(part)<7?'Fill in the blanks. (1 – 6)':'Determine whether the algebraic fractions are in its simplest form.'):stem,source(number?part+'.':'('+part+')',q.q)],
      layout:'question full-work '+(typeof q.decision==='boolean'?'judgement':''),visual:h=>worked(h,q),caption:''};
  }
  function keyPoints(h){
    mount(h,3,n=>{
      if(!n)return '';
      if(n===1)return '<p class="teaching-note">Cancel common factors of the numerator and denominator.</p>'+fraction(product('a','3'),product('a','2'),'3 times a divided by 2 times a')+line(T`\frac{3a}{2a}=\frac32`,'answer')+'<p class="domain">'+M(T`a\ne0`)+'</p>';
      if(n===2)return fraction(product('(m+n)','4'),product('(m+n)','n'),'4 times (m+n) divided by n times (m+n)')+'<p class="teaching-note">A whole bracket can be a common factor.</p>';
      return line(T`\frac{4(m+n)}{n(m+n)}=\frac4n`,'answer')+'<p class="teaching-note">Divide both by the same non-zero factor.</p><p class="domain">'+M(T`n\ne0,\ m+n\ne0`)+'</p>';
    });
  }
  function challenge(h){
    let signs=[1,1,1];
    mount(h,3,n=>{
      const toggles='<div class="sign-controls">'+['a','b','c'].map((v,i)=>'<div><span>'+v+'</span>'+btn('sign-'+i,signs[i]>0?'Positive':'Negative',signs[i]>0?'':'negative')+'</div>').join('')+'</div>';
      if(!n)return toggles;
      const [a,b,c]=signs,terms=[a,b,c,-a*b,-b*c,-c*a,a*b*c],total=terms.reduce((s,v)=>s+v,0);
      if(n===1)return toggles+'<div class="sign-substitution">'+terms.map((v,i)=>'<span>'+M((i?(v<0?'-':'+'):(v<0?'-':''))+'1')+'</span>').join('')+'</div>'+line('='+total,'answer');
      if(n===2)return toggles+'<div class="sign-table"><div>Number of negative values</div><b>0</b><b>1</b><b>2</b><b>3</b><div>Expression value</div><span>1</span><span>1</span><span>1</span><span>−7</span></div><p class="teaching-note">These groups cover all eight sign combinations.</p>';
      return toggles+line(T`1\ \text{or}\ -7`,'answer')+'<p class="teaching-note">The value is −7 when a, b and c are all negative.<br>Otherwise, the value is 1.</p>';
    },{onReset:()=>{signs=[1,1,1];},afterDraw:(_n,_hint,draw)=>{
      signs.forEach((_s,i)=>{const b=h.querySelector('#sign-'+i);b.setAttribute('aria-label','Sign of '+['a','b','c'][i]+': '+(signs[i]>0?'positive':'negative'));b.onclick=()=>{signs[i]*=-1;draw();};});
    }});
  }

  const stem='Simplify the following algebraic fractions.';
  const source=(label,tex)=>`<span class="source-equation">${label} ${M(tex)}</span>`;
  const example={sec:'02',secName:'LN p. 4 · Lesson Worksheet 3.1A',title:'Example 2 (Level 1)',points:[stem,source('(a)','\\frac{3x+6xy}{6x}')],caption:''};

  const pilot=[
    {sec:'01',secName:'LN p. 3 · Lesson Worksheet 3.1A',title:"Let's Check",tocTitle:"Let's Check 9",points:['Determine whether the algebraic fractions are in its simplest form.',source('9.','\\frac{x+y}{3x}')],layout:'question diagnostic',visual:check,caption:''},
    {...example,tocTitle:'Example 2(a) · Analysis',layout:'question factor-analysis',visual:analyse},
    {...example,tocTitle:'Example 2(a) · Solution',layout:'question factor-solution',visual:solve},
    {sec:'03',secName:'LN p. 4 · Lesson Worksheet 3.1A',title:"Let's Try 2",tocTitle:"Let's Try 2(a)",points:[stem,source('(a)','\\frac{8ab}{4a-8ab}')],layout:'question factor-practice',visual:attempt,caption:''}
];
  ['C9','E2a-analysis','E2a','T2a'].forEach((id,i)=>{pilot[i].sourceId=id;pilot[i].sec=i===0?'01':'04';pilot[i].secName='Chapter 3 · LN p. '+(i===0?3:4)+' · Worksheet 3.1A';});
  const find=id=>itemSlide(items.find(q=>q.id===id));
  const slides=[{sec:'00',secName:'Chapter 3 · LN p. 3 · Worksheet 3.1A',title:'Key Points',points:['An algebraic fraction can be reduced to its simplest form by cancelling out the common factor(s) of its numerator and denominator.'],layout:'question key-points',visual:keyPoints,caption:''}];
  // One source question at a time. Switching number starts a fresh, unrevealed task.
  function checkGroup(first,last){
    const judge=first===7;
    return {sec:'01',secName:'Chapter 3 · LN p. 3 · Worksheet 3.1A',title:"Let's Check",tocTitle:"Let's Check "+first+'–'+last,sourceId:'C'+first+'-'+last,questionIds:Array.from({length:6},(_,i)=>'C'+(first+i)),layout:'question check-selector',points:[judge?'Determine whether the algebraic fractions are in its simplest form.':'Fill in the blanks. (1 – 6)'],caption:'',visual:h=>{
      h.innerHTML='<div class="pilot-panel check-group"><nav class="number-tabs" aria-label="Question number">'+Array.from({length:6},(_,i)=>'<button type="button" class="number-tab" data-question="'+(first+i)+'" aria-label="Question '+(first+i)+'">'+(first+i)+'</button>').join('')+'</nav><div class="check-workspace"><div class="selected-source" aria-live="polite"></div><div class="selected-working"></div></div></div>';
      const question=h.querySelector('.selected-source'),working=h.querySelector('.selected-working');
      const select=number=>{
        if(window.MathJax&&MathJax.typesetClear)MathJax.typesetClear([question,working]);
        const q=items.find(item=>item.id==='C'+number);
        question.innerHTML='<span class="question-kicker">Question '+number+'</span>'+line(number===9?T`\frac{x+y}{3x}`:q.q,'selected-equation');
        h.querySelectorAll('.number-tab').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.question)===number)));
        if(number===9)check(working);else worked(working,q);
        if(window.MJ)window.MJ(h);
      };
      h.querySelectorAll('.number-tab').forEach(b=>b.onclick=()=>select(Number(b.dataset.question)));
      select(first);
    }};
  }
  slides.push(checkGroup(1,6),checkGroup(7,12));
  slides.push(...['E1a','E1b','T11a','T11b','T12a','T12b','T12c','T12d'].map(find),pilot[1],pilot[2],find('E2b'),pilot[3],find('T2b'));
  slides.push(...['E3a','E3b','E3c','T3a','T3b','T3c',...Array.from({length:8},(_,i)=>'R'+(i+1))].map(find));
  slides.push({sec:'07',secName:'Chapter 3 · LN p. 4 · Optional challenge',title:'Exercise *9',tocTitle:'Optional · Exercise *9',sourceId:'R9',points:[M(T`abc\ne0`)+'<span class="challenge-intro">If '+M(T`abc\ne0`)+', then</span>', '<span class="challenge-stem">'+M(T`\begin{aligned}&\frac{|a|}{a}+\frac{|b|}{b}+\frac{|c|}{c}\\&-\frac{|ab|}{ab}-\frac{|bc|}{bc}-\frac{|ca|}{ca}+\frac{|abc|}{abc}=\underline{\qquad}\end{aligned}`)+'</span>'],layout:'question optional-challenge',visual:challenge,caption:''});
  // One original condition, kept with the full expression above the exploration.
  slides[slides.length-1].points[0]='If '+M(T`abc\ne0`)+', then';
  // Compositions follow teaching purpose rather than alternating arbitrarily.
  slides.forEach(s=>{
    const id=s.sourceId||'';
    if(id.startsWith('E1'))s.layout+=' studio-split';
    else if(id.startsWith('T11'))s.layout+=' studio-banner';
    else if(id==='T12c')s.layout+=' studio-lab';
    else if(id.startsWith('T12'))s.layout+=id==='T12d'?' studio-banner':' studio-split';
    else if(id==='E2a-analysis')s.layout+=' studio-split';
    else if(id==='E2a'||id==='E2b')s.layout+=' studio-ledger';
    else if(id==='T2a')s.layout+=' studio-banner';
    else if(id==='T2b')s.layout+=' studio-ledger';
    else if(id.startsWith('E3'))s.layout+=' studio-ledger';
    else if(id.startsWith('T3'))s.layout+=' studio-banner';
    else if(/^R[1-8]$/.test(id))s.layout+=' studio-split';
    else if(id==='R9')s.layout+=' studio-lab';
    else if(!id)s.layout+=' studio-concept';
  });
  window.DECK.push({ch:3,title:'Algebraic Fractions',color:'#52664b',sections:['00 Key Points',"01 Let's Check",'02 Example 1 and practice','03 Brackets and opposite expressions','04 Example 2 and practice','05 Example 3 and practice','06 Exercise 1–8','07 Optional challenge'],slides});
})();
