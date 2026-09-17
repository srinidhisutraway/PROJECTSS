class Hello{
    public static void main(String[] args){
        
        StringBuilder sb= new StringBuilder("hi");
        System.out.println(sb);

        sb.append("hello");
        System.out.println(sb);
        sb.delete(2,4);
        System.out.println(sb);
        sb.insert(2,"he");
        System.out.println(sb);
        sb.replace(1,4,"hi");
                System.out.println(sb);







    }
}