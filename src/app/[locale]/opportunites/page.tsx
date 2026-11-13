import BulletinIndex from "@/components/site/bulletin-index";
export default function Page(props:{params:Promise<{locale:string}>;searchParams:Promise<{archives?:string}>}) {return <BulletinIndex kind="opportunites" {...props}/>;}
