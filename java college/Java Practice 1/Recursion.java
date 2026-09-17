public class Recursion {
    static void Recall(String name,int count,int n){
        if(count==n){
            return;
        }
    
            System.out.println(name);
            Recall(name,count+1,n);
        
    }
    public static void main(String[] args) {
        Recall("hii",0,5);
        

    }
    
}
