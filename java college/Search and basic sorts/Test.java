public class Test {
    public static void main(String[] args) {
        vlaue v=new vlaue();
        int x=10;
        Change(v,5);
        // System.out.println(v.x);
    }  
}
static void Change(vlaue obj,int ele){
     obj.x=ele;
}
class vlaue{
     int x;
    
}
